import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import TransactionService from '../services/Transactions';
import JwtService from '../services/jwtService';

export default class TransactionController {
  constructor(private transactionService: TransactionService) {}

  cashIn = async (req: Request, res: Response) => {
    const token = String(req.headers.authorization);
    const data = JwtService.validateToken(token);
    const transactions = await this.transactionService.cashIn(data.accountId);
    res.status(StatusCodes.OK).json(transactions);
  };

  cashOut = async (req: Request, res: Response) => {
    const token = String(req.headers.authorization);
    const data = JwtService.validateToken(token);
    const transactions = await this.transactionService.cashOut(data.accountId);
    res.status(StatusCodes.OK).json(transactions);
  };

  allTransactions = async (req: Request, res: Response) => {
    const token = String(req.headers.authorization);
    const data = JwtService.validateToken(token);
    const transactions = await this.transactionService
      .allTransactions(data.accountId);
    res.status(StatusCodes.OK).json(transactions);
  };

  createTransaction = async (req: Request, res: Response) => {
    const { value, username } = req.body;
    const token = String(req.headers.authorization);
    const data = await JwtService.validateToken(token);
    const transaction = await this.transactionService
      .createTransaction(username, value, data);
    res.status(StatusCodes.CREATED).json(transaction);
  };
}