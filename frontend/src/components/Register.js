import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import { setAuthToken } from '../api';

export default function Register({ setUser }) {
  const [name, setName] = useState(''), [email, setEmail] = useState(''), [password, setPassword] = useState('');
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/register', { name, email, password });
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
      <h3>Register</h3>
      <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} required />
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
      <button type="submit">Register</button>
    </form>
  );
}
