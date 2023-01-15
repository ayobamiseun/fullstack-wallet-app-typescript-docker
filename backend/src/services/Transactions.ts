/* eslint-disable max-len */
import { Op } from 'sequelize';
import Account from '../database/models/Account';
import Transaction from '../database/models/Transaction';
import User from '../database/models/User';
import IAccount from '../interfaces/IAccount';
import ITransaction from '../interfaces/ITransaction';

export default class TransactionService {
  cashIn = async (accountId: number): Promise<ITransaction[]> => {
    const transactions = await Transaction.findAll({
      where: { creditedAccountId: accountId },
      include: [
        { model: User, as: 'debitedUser', attributes: ['username'] },
        { model: User, as: 'creditedUser', attributes: ['username'] },
      ],
      order: [ ['createdAt', 'ASC'] ],
    });
    return transactions;
  };

  cashOut = async (accountId: number): Promise<ITransaction[]> => {
    const transactions = await Transaction.findAll({
      where: { debitedAccountId: accountId },
      include: [
        { model: User, as: 'debitedUser', attributes: ['username'] },
        { model: User, as: 'creditedUser', attributes: ['username'] },
      ],
      order: [ ['createdAt', 'ASC'] ],
    });
    return transactions;
  };

  allTransactions = async (accountId: number): Promise<ITransaction[]> => {
    const transactions = await Transaction.findAll({
      where: { [Op.or]: {
        debitedAccountId: accountId,
        creditedAccountId: accountId,
      } },
      include: [
        { model: User, as: 'debitedUser', attributes: ['username'] },
        { model: User, as: 'creditedUser', attributes: ['username'] },
      ],
      order: [ ['createdAt', 'ASC'] ],
    });
    return transactions;
  };

  decrementBalance = async (value: number, accountId: number) => {
    const account = await Account.findByPk(accountId);
    if (!account) throw Error('EntityNotFound');
    if (account.balance < value) throw Error('InsuficientFounds');
    await Account.decrement(
      { balance: value },
      { where: { id: accountId } },
    );
  };

  incrementBalance = async (value: number, accountId: number) => {
    const account = await Account.findByPk(accountId);
    if (!account) throw Error('EntityNotFound');
    await Account.increment(
      { balance: value },
      { where: { id: accountId } },
    );
  };

  createTransaction = async (usernameCashIn: string, value: number, accountCashOut: IAccount)
  : Promise<ITransaction | undefined> => {
    const userCashIn = await User.findOne({
      where: { username: usernameCashIn }, attributes: ['username', 'accountId'] });
    if (!userCashIn) throw Error('EntityNotFound');
    if (userCashIn.accountId === accountCashOut.id) throw Error('ConflictAccountId');

    try {
      await this.decrementBalance(value, accountCashOut.id);
      await this.incrementBalance(value, userCashIn.accountId);

      const newTransaction = await Transaction.create({
        value, debitedAccountId: accountCashOut.id, creditedAccountId: userCashIn.accountId,
      });
      return newTransaction;      
    } catch (error) {
      let message = 'GenericError';
      if (error instanceof Error) message = error.message;
      throw Error(message);
    }
  };
}
