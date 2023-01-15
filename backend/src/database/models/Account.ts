import { INTEGER, Model, DECIMAL } from 'sequelize';
import db from '.';

class Account extends Model {
  id!: number;
  balance!: number;
}

Account.init({
  id: {
    type: INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  balance: {
    type: DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 100.00,
  },
}, {
  sequelize: db,
  modelName: 'Account',
  tableName: 'accounts',
  timestamps: false,
});

export default Account;