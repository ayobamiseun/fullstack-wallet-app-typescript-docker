import { INTEGER, Model, STRING } from 'sequelize';
import db from '.';
import Account from './Account';

class User extends Model {
  id!: number;
  username!: string;
  password!: string;
  accountId!: number;
  email!: string;
  static associate: () => void;
}

User.init({
  id: {
    type: INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: STRING,
    allowNull: false,
  },
  email: { 
    type: STRING,
    allowNull: false,
    unique: true,
  },
  accountId: {
    type: INTEGER,
    allowNull: false,
    references: {
      model: 'Account',
      key: 'id',
    },
  },
}, {
  sequelize: db,
  modelName: 'User',
  tableName: 'users',
  timestamps: false,
});

User.belongsTo(Account, { foreignKey: 'accountId', as: 'account' });

export default User;