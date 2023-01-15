import { useState, useEffect } from 'react';
import moment from 'moment';
import { getUser } from '../services/localStorage';
import {
  allTransactions,
  cashInTransactions,
  cashOutTransactions,
} from '../services/apiRequests';
import type ITransaction from '../interfaces/ITransaction';
import Header from '../components/Header';

export default function Account() {
  const [userToken, setUserToken] = useState('');
  const [list, setList] = useState<ITransaction[] | null>([]);

  useEffect(() => {
    try {
      const { token } = getUser();
      setUserToken(token);
      allTransactions(token).then((dataObj) => {
        setList(dataObj);
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  const cashIn = async () => {
    const data = await cashInTransactions(userToken);
    setList(data);
  };

  const cashOut = async () => {
    const data = await cashOutTransactions(userToken);
    setList(data);
  };

  const listAll = async () => {
    const data = await allTransactions(userToken);
    setList(data);
  };

  return (
    <>
      <Header />

      <div className="max-w-6xl mx-auto p-4 mt-6">
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <button
            onClick={cashIn}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2 rounded-md transition"
          >
            Cash In
          </button>
          <button
            onClick={cashOut}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2 rounded-md transition"
          >
            Cash Out
          </button>
          <button
            onClick={listAll}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-5 py-2 rounded-md transition"
          >
            All Transactions
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
              <tr>
                <th className="px-4 py-3 text-left">Transaction ID</th>
                <th className="px-4 py-3 text-left">From</th>
                <th className="px-4 py-3 text-left">To</th>
                <th className="px-4 py-3 text-left">Value</th>
                <th className="px-4 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {list?.map((element) => (
                <tr
                  key={element.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 text-gray-800">{element.id}</td>
                  <td className="px-4 py-3 text-gray-700">
                    {element.debitedUser.username}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {element.creditedUser.username}
                  </td>
                  <td className="px-4 py-3 text-green-700 font-semibold">
                    ${element.value.replace('.', ',')}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {moment(element.createdAt).format('DD/MM/YYYY')}
                  </td>
                </tr>
              ))}
              {list?.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center text-gray-500 py-6 italic"
                  >
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
