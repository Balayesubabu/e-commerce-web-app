import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

export default function Checkout({ user }) {
  const [name, setName] = useState(user ? user.name : '');
  const [email, setEmail] = useState(user ? user.email : '');
  const nav = useNavigate();

  const submit = async () => {
    try {
      if (user) {
        const token = JSON.parse(localStorage.getItem('auth')).token;
        const res = await API.post('/orders/checkout', { token });
        nav('/order/' + res.data.orderId);
      } else {
        const g = JSON.parse(localStorage.getItem('guestCart') || '[]');
        if (!g.length) return alert('Cart empty');
        const payloadItems = g.map(it => ({ productId: it.productId, size: it.size, quantity: it.quantity }));
        const res = await API.post('/orders/checkout', { items: payloadItems, customerName: name, customerEmail: email });
        localStorage.removeItem('guestCart');
        nav('/order/' + res.data.orderId);
      }
    } catch (err) {
      alert(err?.response?.data?.msg || 'Checkout error');
    }
  };

  return (
    <div style={{maxWidth:600}}>
      <h3>Checkout</h3>
      <div>
        <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      </div>
      <button onClick={submit}>Confirm Order (Mock)</button>
    </div>
  );
}
