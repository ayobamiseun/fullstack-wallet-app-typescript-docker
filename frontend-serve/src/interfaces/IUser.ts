export default interface IUser {
  user: {
    id: string;
    username: string;
    accountId: string;
  },
  token: string;
}