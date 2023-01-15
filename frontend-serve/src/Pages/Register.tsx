import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userRegister } from '../services/apiRequests';

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleClick = async () => {
    console.log({ username, password });
    await userRegister({ username, password });
    navigate('/');
  };

  const isValid = () => {
    const three = 3;
    const reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    return !(reg.test(password) && username.length >= three);
  };

  return (
    <form className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <div className="space-y-6">
        <label htmlFor="username" className="block">
          <span className="block text-sm font-medium text-gray-700 mb-1">USERNAME</span>
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="username"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
            required
          />
        </label>

        <label htmlFor="password" className="block">
          <span className="block text-sm font-medium text-gray-700 mb-1">PASSWORD</span>
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="password"
            placeholder="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            required
          />
        </label>
      </div>

      <div className="mt-8">
        <button
          className={`w-full py-2 px-4 rounded-md text-white font-semibold ${
            isValid()
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 transition'
          }`}
          type="button"
          disabled={isValid()}
          onClick={handleClick}
        >
          CREATE ACCOUNT
        </button>
      </div>
    </form>
  );
}
