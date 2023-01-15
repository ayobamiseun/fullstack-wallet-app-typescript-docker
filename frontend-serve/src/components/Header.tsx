import { useState, useEffect } from 'react';
import { getUser } from '../services/localStorage';
import { accountById, createTransaction } from '../services/apiRequests';
import type IAccount from '../interfaces/IAccount';

export default function Header() {
  const [user, setUser] = useState('');
  const [userToken, setUserToken] = useState('');
  const [balance, setBalance] = useState<IAccount | null>(null);
  const [showHidden, setShowHidden] = useState(false);
  const [userSend, setUserSend] = useState('');
  const [value, setValue] = useState('');

  useEffect(() => {
    try {
      const {
        user: { accountId, username },
        token,
      } = getUser();
      setUser(username);
      setUserToken(token);
      accountById(accountId, token).then((dataObj) => {
        setBalance(dataObj.balance);
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  const newTransaction = async () => {
    try {
      const data = { username: userSend, value };
      await createTransaction(data, userToken);
      setShowHidden(false);
      setUserSend('');
      setValue('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xl font-semibold text-gray-800">{`Hello, ${user}`}</p>
          <p className="text-gray-600">
            Your balance account is:{' '}
            <span className="font-medium text-green-600">
              ${String(balance || '0.00').replace('.', ',')}
            </span>
          </p>
        </div>
        <button
          onClick={() => setShowHidden(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          New Transaction
        </button>
      </div>

      {showHidden && (
        <form
          className="mt-6 bg-gray-50 p-4 rounded-md border border-gray-200 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            newTransaction();
          }}
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Recipient Username"
              value={userSend}
              onChange={({ target }) => setUserSend(target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="number"
              placeholder="Amount"
              value={value}
              onChange={({ target }) => setValue(target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
            >
              Confirm
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
