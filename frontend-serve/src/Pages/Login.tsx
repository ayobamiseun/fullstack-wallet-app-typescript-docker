import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userLogin } from '../services/apiRequests';
import { saveUser } from '../services/localStorage';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showHidden, setShowHidden] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateUsername = (name) => {
    if (name.length < 3) return 'Username must be at least 3 characters.';
    return '';
  };

  const validatePassword = (pwd) => {
    const reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    if (!reg.test(pwd)) return 'Password must be strong (e.g. A@1abcd...)';
    return '';
  };

  useEffect(() => {
    setUsernameError(validateUsername(username));
  }, [username]);

  useEffect(() => {
    setPasswordError(validatePassword(password));
  }, [password]);

  const handleClickLogin = async () => {
    setLoading(true);
    setShowHidden(false);
    try {
      const userData = await userLogin({ username, password });
      const { user } = userData;
      saveUser(userData);
      navigate(`/account/${user.accountId}`);
    } catch (error) {
      setShowHidden(true);
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = () =>
    loading || usernameError !== '' || passwordError !== '';

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[url('/images/login-bg.jpg')] bg-cover bg-center z-0" />
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-blue-800/60 backdrop-blur-sm z-0" />

      {/* Form */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="w-full max-w-md bg-white/90 backdrop-blur-lg shadow-2xl rounded-2xl p-8 space-y-6"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800">Login</h2>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
              required
            />
            {usernameError && <p className="text-sm text-red-500 mt-1">{usernameError}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              required
            />
            {passwordError && <p className="text-sm text-red-500 mt-1">{passwordError}</p>}
          </div>

          {showHidden && (
            <p className="text-sm text-red-500 text-center font-semibold">
              Username or password invalid
            </p>
          )}

          <button
            type="button"
            className={`w-full py-3 rounded-lg text-white font-semibold text-lg shadow-md transition duration-300 ease-in-out transform ${
              isDisabled()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98]'
            }`}
            onClick={handleClickLogin}
            disabled={isDisabled()}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div className="text-center">
            <span className="text-sm text-gray-600">Don't have an account?</span>
            <Link to="/register">
              <button type="button" className="ml-2 text-blue-600 hover:underline font-medium">
                Create Account
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
