import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import { setAuthToken } from '../api';

export default function Login({ setUser }) {
  const [email, setEmail] = useState(''), [password, setPassword] = useState('');
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { email, password });
      const { token, user } = res.data;
      localStorage.setItem('auth', JSON.stringify({ token, user }));
      setAuthToken(token);
      setUser(user);
      nav('/');
    } catch (err) {
      alert(err?.response?.data?.msg || 'Error');
    }
  };

  return (
    <form onSubmit={submit} style={{maxWidth:400}}>
      <h3>Login</h3>
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
      <button type="submit">Login</button>
    </form>
  );
}
