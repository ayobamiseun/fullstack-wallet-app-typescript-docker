import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Account from './Pages/Account';
import Login from './Pages/Login';
import NotFound from './Pages/NotFound';
import Register from './Pages/Register';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <BrowserRouter>
           <ToastContainer position="top-right" autoClose={4000} />
      <Routes>
        <Route path="/" element={ <Login /> } />
        <Route path="/register" element={ <Register /> } />
        <Route path="/account/:id" element={ <Account /> } />
        <Route path="*" element={ <NotFound /> } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
