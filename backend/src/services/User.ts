import md5 from 'md5';
import Sequelize from '../database/models/index';
import User from '../database/models/User';
import Account from '../database/models/Account';
import PasswordResetToken from '../database/models/PasswordResetToken'; // New model
import IUserJwt from '../interfaces/IUserJwt';
import { IUser, INewUser } from '../interfaces/IUser';
import { validateUser, validatePassword } from './validatorService';
import crypto from 'crypto';
import { Op } from 'sequelize';

export default class UserService {
  private RESET_TOKEN_EXPIRY_HOURS = 1; // Token expires in 1 hour

  findUser = async (username: string): Promise<IUser> => {
    const user = await User.findOne({ where: { username } });
    if (!user) throw Error('EntityNotFound');
    return user;
  };

  login = async (username: string, password: string): Promise<IUserJwt> => {
    const user = await this.findUser(username);
    if (!user || user.password !== md5(password)) {
      throw Error('UnauthorizedError');
    }
    return { id: user.id, username: user.username, accountId: user.accountId };
  };

  createUserAccount = async (obj: INewUser): Promise<User | undefined> => {
    const t = await Sequelize.transaction();

    const { username, password } = obj;
    validateUser(obj);

    try {
      const account = await Account.create({}, { transaction: t });

      const [user, created] = await User.findOrCreate({
        where: { username },
        defaults: { username, password: md5(password), accountId: account.id },
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
    // First, clean up any existing tokens for this user
    await PasswordResetToken.destroy({
      where: {
        userId: (await this.findUser(username)).id,
      }
    });

    // Create a new reset token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + this.RESET_TOKEN_EXPIRY_HOURS);

    await PasswordResetToken.create({
      token,
      userId: (await this.findUser(username)).id,
      expiresAt,
    });

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

  resetPasswordWithToken = async (token: string, newPassword: string): Promise<void> => {
    const t = await Sequelize.transaction();

    try {
      // Validate the token
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

      // Validate the new password
      validatePassword(newPassword);

      // Update the user's password
      await User.update(
        { password: md5(newPassword) },
        {
          where: { id: resetToken.userId },
          transaction: t,
        }
      );

      // Delete the used token
      await PasswordResetToken.destroy({
        where: { id: resetToken.id },
        transaction: t,
      });

      await t.commit();
    } catch (error) {
      await t.rollback();
      throw error;
    }
  };
}