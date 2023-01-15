export default interface ITransaction {
  id: number;
  value: string;
  createdAt: string;
  creditedUser: {
    username: string;
  };
  debitedUser: {
    username: string;
  };
}