import React, { useEffect, useState } from 'react';
import API from '../api';
import { Link, useNavigate } from 'react-router-dom';

export default function CartPage({ user }) {
  const [items, setItems] = useState([]);
  const nav = useNavigate();

  const load = async () => {
    if (user) {
      const token = JSON.parse(localStorage.getItem('auth')).token;
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const res = await API.get('/cart');
      setItems(res.data.items.map(it => ({ ...it, name: it.product.name, price: it.product.price, image: it.product.image, productId: it.product._id })));
    } else {
      const g = JSON.parse(localStorage.getItem('guestCart') || '[]');
      setItems(g);
    }
  };

  useEffect(()=>{ load(); /* eslint-disable-next-line */ }, [user]);

  const update = async (productId, size, quantity) => {
    if (user) {
      const token = JSON.parse(localStorage.getItem('auth')).token;
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      await API.post('/cart/add', { productId, size, quantity });
      load();
    } else {
      const g = JSON.parse(localStorage.getItem('guestCart') || '[]');
      const idx = g.findIndex(it => it.productId === productId && it.size === size);
      if (idx > -1) {
        g[idx].quantity = quantity;
        localStorage.setItem('guestCart', JSON.stringify(g));
        setItems(g);
      }
    }
  };

  const remove = async (productId, size) => {
    if (user) {
      const token = JSON.parse(localStorage.getItem('auth')).token;
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      await API.post('/cart/remove', { productId, size });
      load();
    } else {
      let g = JSON.parse(localStorage.getItem('guestCart') || '[]');
      g = g.filter(it => !(it.productId === productId && it.size === size));
      localStorage.setItem('guestCart', JSON.stringify(g));
      setItems(g);
    }
  };

  const total = items.reduce((s,i) => s + i.price * i.quantity, 0);

  return (
    <div>
      <h3>Your Cart</h3>
      {items.length === 0 ? <div>Empty. <Link to="/">Shop now</Link></div> :
        <>
          {items.map(it => (
            <div key={it.productId + '-' + it.size} style={{display:'flex', gap:12, alignItems:'center', borderBottom:'1px solid #eee', padding:8}}>
              <img src={it.image} alt="" style={{width:80}}/>
              <div style={{flex:1}}>
                <div>{it.name}</div>
                <div>Size: {it.size}</div>
              </div>
              <div>₹{it.price}</div>
              <input type="number" min="1" value={it.quantity} onChange={e=>update(it.productId, it.size, Number(e.target.value))} style={{width:60}} />
              <button onClick={()=>remove(it.productId, it.size)}>Remove</button>
            </div>
          ))}
          <div style={{marginTop:12}}><strong>Total: ₹{total}</strong></div>
          <div style={{marginTop:12}}>
            <button onClick={()=>nav('/checkout')}>Proceed to Checkout</button>
          </div>
        </>
      }
    </div>
  );
}
