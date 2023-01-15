import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import AccountService from '../services/Account';

export default class AccountController {
  constructor(private accountService: AccountService) {}

  balanceAccount = async (req: Request, res: Response) => {
    const { id } = req.params;
    const token = String(req.headers.authorization);
    await this.accountService.checkIfIsAuthorized(token, id);

    const balance = await this.accountService.balanceAccount(id);
    res.status(StatusCodes.OK).json(balance);
  };
}