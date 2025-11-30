import React, { useEffect, useState } from 'react';
import API from '../api';
import { Link } from 'react-router-dom';

export default function ProductList(){
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [size, setSize] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetch = async () => {
    const q = new URLSearchParams({ search, category, size, minPrice, maxPrice, page, limit: 8 });
    const res = await API.get('/products?' + q.toString());
    setProducts(res.data.items);
    setPages(res.data.pages);
  };

  useEffect(()=>{ fetch(); /* eslint-disable-next-line */ }, [page]);

  const doSearch = async () => { setPage(1); fetch(); };

  const handleImageError = (e) => {
    // Fallback to a default placeholder if image fails to load
    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%23ddd" width="300" height="300"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="20" fill="%23999"%3EImage Not Available%3C/text%3E%3C/svg%3E';
  };

  return (
    <div>
      <div className="controls">
        <input placeholder="Search" value={search} onChange={e=>setSearch(e.target.value)} />
        <select value={category} onChange={e=>setCategory(e.target.value)}>
          <option value="">All categories</option>
          <option>Men</option><option>Women</option><option>Kids</option>
        </select>
        <select value={size} onChange={e=>setSize(e.target.value)}>
          <option value="">Any size</option>
          <option>S</option><option>M</option><option>L</option><option>XL</option>
        </select>
        <input placeholder="Min" style={{width:80}} value={minPrice} onChange={e=>setMinPrice(e.target.value)} />
        <input placeholder="Max" style={{width:80}} value={maxPrice} onChange={e=>setMaxPrice(e.target.value)} />
        <button onClick={doSearch}>Apply</button>
      </div>

      <div className="products">
        {products.map(p => (
          <div key={p._id} className="card">
            <img src={p.image} alt={p.name} onError={handleImageError} style={{width:'100%', height:'250px', objectFit:'cover', backgroundColor:'#f0f0f0'}}/>
            <h4>{p.name}</h4>
            <p>₹{p.price}</p>
            <Link to={`/product/${p._id}`}>View</Link>
          </div>
        ))}
      </div>

      <div style={{marginTop:16}}>
        <button onClick={()=>setPage(s=>Math.max(1,s-1))}>Prev</button>
        <span style={{margin:'0 8px'}}>Page {page} / {pages}</span>
        <button onClick={()=>setPage(s=>Math.min(pages,s+1))}>Next</button>
      </div>
    </div>
  );
}
