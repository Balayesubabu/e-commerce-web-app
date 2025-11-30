import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Register from './components/Register';
import Login from './components/Login';
import CartPage from './components/CartPage';
import Checkout from './components/Checkout';
import OrderConfirmation from './components/OrderConfirmation';
import API, { setAuthToken } from './api';

export default function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const data = localStorage.getItem('auth');
    if (data) {
      const parsed = JSON.parse(data);
      setUser(parsed.user);
      setAuthToken(parsed.token);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('auth');
    setUser(null);
    setAuthToken(null);
  };

  return (
    <BrowserRouter>
      <div className="nav">
        <Link to="/">Home</Link>
        <Link to="/cart">Cart</Link>
        {user ? (
          <>
            <span>Hi, {user.name}</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
      <div className="container">
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/register" element={<Register setUser={setUser} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/cart" element={<CartPage user={user} />} />
          <Route path="/checkout" element={<Checkout user={user} setUser={setUser} />} />
          <Route path="/order/:id" element={<OrderConfirmation />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
