import React, { useEffect, useState } from 'react';
import API from '../api';
import { useParams, useNavigate } from 'react-router-dom';

export default function ProductDetail(){
  const { id } = useParams();
  const [p, setP] = useState(null);
  const [size, setSize] = useState('');
  const [qty, setQty] = useState(1);
  const navigate = useNavigate();

  useEffect(()=>{
    API.get('/products/' + id).then(r=>setP(r.data));
  },[id]);

  const addToCart = async () => {
    const auth = localStorage.getItem('auth');
    if (auth) {
      const token = JSON.parse(auth).token;
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      await API.post('/cart/add', { productId: p._id, size, quantity: qty });
      alert('Added to cart (saved to your account)');
      navigate('/cart');
    } else {
      const g = JSON.parse(localStorage.getItem('guestCart') || '[]');
      const idx = g.findIndex(it => it.productId === p._id && it.size === size);
      if (idx > -1) g[idx].quantity = qty;
      else g.push({ productId: p._id, name: p.name, price: p.price, image: p.image, size, quantity: qty });
      localStorage.setItem('guestCart', JSON.stringify(g));
      alert('Added to guest cart (saved locally)');
      navigate('/cart');
    }
  };

  const handleImageError = (e) => {
    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23ddd" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="20" fill="%23999"%3EImage Not Available%3C/text%3E%3C/svg%3E';
  };

  if (!p) return <div>Loading...</div>;
  return (
    <div style={{display:'flex', gap:20}}>
      <img src={p.image} alt={p.name} style={{width:320, height:320, objectFit:'cover', backgroundColor:'#f0f0f0'}} onError={handleImageError} />
      <div>
        <h2>{p.name}</h2>
        <p>{p.description}</p>
        <p>₹{p.price}</p>
        <div>
          <select value={size} onChange={e=>setSize(e.target.value)}>
            <option value="">Select size</option>
            {p.sizes.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <input type="number" min="1" value={qty} onChange={e=>setQty(e.target.value)} style={{width:60, marginLeft:8}}/>
        </div>
        <div style={{marginTop:12}}>
          <button onClick={addToCart} disabled={!size}>Add to cart</button>
        </div>
      </div>
    </div>
  );
}
