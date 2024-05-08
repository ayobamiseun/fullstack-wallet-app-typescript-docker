import bcrypt from 'bcryptjs';
import md5 from 'md5';
import Sequelize from '../database/models/index';
import User from '../database/models/User';
import Account from '../database/models/Account';
import PasswordResetToken from '../database/models/PasswordResetToken';
import RefreshToken from '../database/models/RefreshToken';
import IUserJwt from '../interfaces/IUserJwt';
import { INewUser } from '../interfaces/IUser';
import { validateUser, validatePassword } from './validatorService';
import JwtService from './jwtService';
import { verifyTotp } from './Profile';
import crypto from 'crypto';
import { Op } from 'sequelize';

export interface IssuedTokens {
  accessToken: string;
  refreshToken: string;
}

const BCRYPT_COST = 10;
const LEGACY_MD5_PATTERN = /^[a-f0-9]{32}$/i;

export default class UserService {
  private RESET_TOKEN_EXPIRY_HOURS = 1;

  findUser = async (username: string): Promise<User> => {
    const user = await User.findOne({ where: { username } });
    if (!user) throw Error('EntityNotFound');
    return user;
  };

  login = async (
    username: string,
    password: string,
    totp?: string,
  ): Promise<IUserJwt> => {
    const user = await this.findUser(username);
    if (user.frozen) throw Error('UserFrozen');

    const stored = user.password;
    let ok = false;

    if (stored.startsWith('$2')) {
      ok = await bcrypt.compare(password, stored);
    } else if (LEGACY_MD5_PATTERN.test(stored) && stored === md5(password)) {
      // Legacy MD5 hash — accept once, then upgrade to bcrypt transparently.
      ok = true;
      const upgraded = await bcrypt.hash(password, BCRYPT_COST);
      await User.update({ password: upgraded }, { where: { id: user.id } });
    }

    if (!ok) throw Error('UnauthorizedError');

    if (user.totpEnabled && user.totpSecret) {
      if (!totp) throw Error('TwoFactorRequired');
      if (!verifyTotp(user.totpSecret, totp)) throw Error('TwoFactorInvalid');
    }

    return { id: user.id, username: user.username, accountId: user.accountId };
  };

  createUserAccount = async (obj: INewUser): Promise<User | undefined> => {
    const t = await Sequelize.transaction();

    const { username, password } = obj;
    validateUser(obj);

    try {
      const account = await Account.create({}, { transaction: t });
      const hashed = await bcrypt.hash(password, BCRYPT_COST);

      const [user, created] = await User.findOrCreate({
        where: { username },
        defaults: { username, password: hashed, accountId: account.id },
        transaction: t,
      });
      if (!created) throw Error('ConflictError');

      await t.commit();
      return user;
    } catch (error) {
      await t.rollback();
      console.error(error);
    }
  };

  createPasswordResetToken = async (username: string): Promise<string> => {
    const user = await this.findUser(username);

    await PasswordResetToken.destroy({ where: { userId: user.id } });

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + this.RESET_TOKEN_EXPIRY_HOURS);

    await PasswordResetToken.create({ token, userId: user.id, expiresAt });

    return token;
  };

  verifyPasswordResetToken = async (token: string): Promise<void> => {
    const resetToken = await PasswordResetToken.findOne({
      where: {
        token,
        expiresAt: { [Op.gt]: new Date() },
      },
      include: [User],
    });

    if (!resetToken) {
      throw new Error('Invalid or expired token');
    }
  };

  issueTokens = async (user: IUserJwt): Promise<IssuedTokens> => {
    const accessToken = JwtService.createToken(user);
    const { raw, hash, expiresAt } = JwtService.createRefreshToken();
    await RefreshToken.create({ tokenHash: hash, userId: user.id, expiresAt });
    return { accessToken, refreshToken: raw };
  };

  rotateRefreshToken = async (
    rawToken: string,
  ): Promise<{ user: IUserJwt; tokens: IssuedTokens }> => {
    const tokenHash = JwtService.hashRefreshToken(rawToken);
    const existing = await RefreshToken.findOne({ where: { tokenHash } });

    if (
      !existing
      || existing.revokedAt
      || existing.expiresAt.getTime() <= Date.now()
    ) {
      throw Error('UnauthorizedError');
    }

    await RefreshToken.update(
      { revokedAt: new Date() },
      { where: { id: existing.id } },
    );

    const user = await User.findByPk(existing.userId);
    if (!user) throw Error('UnauthorizedError');

    const userJwt: IUserJwt = {
      id: user.id,
      username: user.username,
      accountId: user.accountId,
    };
    const tokens = await this.issueTokens(userJwt);
    return { user: userJwt, tokens };
  };

  revokeRefreshToken = async (rawToken: string): Promise<void> => {
    const tokenHash = JwtService.hashRefreshToken(rawToken);
    await RefreshToken.update(
      { revokedAt: new Date() },
      { where: { tokenHash, revokedAt: null } },
    );
  };

  resetPasswordWithToken = async (token: string, newPassword: string): Promise<void> => {
    const t = await Sequelize.transaction();

    try {
      const resetToken = await PasswordResetToken.findOne({
        where: {
          token,
          expiresAt: { [Op.gt]: new Date() },
        },
        include: [User],
        transaction: t,
      });

      if (!resetToken) {
        throw new Error('Invalid or expired token');
      }

      validatePassword(newPassword);

      const hashed = await bcrypt.hash(newPassword, BCRYPT_COST);

      await User.update(
        { password: hashed },
        { where: { id: resetToken.userId }, transaction: t },
      );

      await PasswordResetToken.destroy({
        where: { id: resetToken.id },
        transaction: t,
      });

      await RefreshToken.update(
        { revokedAt: new Date() },
        { where: { userId: resetToken.userId, revokedAt: null }, transaction: t },
      );

      await t.commit();
    } catch (error) {
      await t.rollback();
      throw error;
    }
  };
}
