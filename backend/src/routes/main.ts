import AccountController from '../controllers/Account';
import TransactionController from '../controllers/Transactions';
import UserController from '../controllers/User';
import AccountService from '../services/Account';
import TransactionService from '../services/Transactions';
import UserService from '../services/User';

const userService = new UserService();
const userController = new UserController(userService);

const accountService = new AccountService();
const accountController = new AccountController(accountService);

const transactionService = new TransactionService();
const transactionController = new TransactionController(transactionService);

export { userController, accountController, transactionController };