import Account from '../database/models/Account';
import IAccount from '../interfaces/IAccount';
import JwtService from './jwtService';
import IUserJwt from '../interfaces/IUserJwt';

export default class AccountService {
  balanceAccount = async (id: string): Promise<IAccount | null> => {
    const account = await Account.findByPk(id);
    return account;
  };

  checkIfIsAuthorized = async (token: string, id: string) => {
    const data: IUserJwt = JwtService.validateToken(token);
    const accountId = await this.balanceAccount(id);

    if (data.accountId !== accountId?.id) throw Error('UnauthorizedError');
  };
}
