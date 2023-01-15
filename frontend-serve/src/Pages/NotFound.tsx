import React from 'react';
import { Link } from 'react-router-dom';
import notfound from '../assets/images/notfound.jpeg';

class NotFound extends React.Component {
  render() {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
        <Link to="/" className="mb-6">
          <p className="text-blue-600 text-lg font-semibold hover:underline">
            HOMEPAGE
          </p>
        </Link>
        <img
          src={notfound}
          alt="not-found"
          className="max-w-full h-auto rounded-lg shadow-lg"
        />
      </div>
    );
  }
}

export default NotFound;
