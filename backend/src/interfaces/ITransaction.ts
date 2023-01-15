export default interface ITransaction {
  id?: number;
  value: number;
  debitedAccountId: number;
  creditedAccountId: number;
  createdAt?: Date;
}