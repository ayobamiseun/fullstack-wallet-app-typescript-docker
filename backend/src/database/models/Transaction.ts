import { DATE, DECIMAL, INTEGER, NOW, Model } from 'sequelize';
import db from '.';
import Account from './Account';
import User from './User';

class Transaction extends Model {
  id!: number;
  value!: number;
  debitedAccountId!: number;
  creditedAccountId!: number;
  createdAt!: Date;
}

Transaction.init({
  id: {
    type: INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  value: {
    type: DECIMAL(12, 2),
    allowNull: false,
  },
  debitedAccountId: {
    type: INTEGER,
    allowNull: false,
    references: {
      model: 'Account',
      key: 'id',
    },
  },
  creditedAccountId: {
    type: INTEGER,
    allowNull: false,
    references: {
      model: 'Account',
      key: 'id',
    },
  },
  createdAt: {
    type: DATE,
    allowNull: false,
    defaultValue: NOW(),
  },
}, {
  sequelize: db,
  modelName: 'Transaction',
  tableName: 'transactions',
  timestamps: false,
});

Transaction.belongsTo(
  Account,
  { foreignKey: 'creditedAccountId', as: 'creditedAccount' },
);

Transaction.belongsTo(
  Account,
  { foreignKey: 'debitedAccountId', as: 'debitedAccount' },
);

Transaction.hasOne(
  User,
  { 
    sourceKey: 'debitedAccountId',
    foreignKey: 'accountId',
    as: 'debitedUser',
  },
);

Transaction.hasOne(
  User,
  { 
    sourceKey: 'creditedAccountId',
    foreignKey: 'accountId',
    as: 'creditedUser',
  },
);

export default Transaction;