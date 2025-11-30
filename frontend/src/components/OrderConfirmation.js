import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function OrderConfirmation(){
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(()=>{
    setOrder({ _id: id });
  },[id]);

  return (
    <div>
      <h3>Order placed!</h3>
      <p>Your order id: {order? order._id : '—'}</p>
      <p>We have sent a confirmation email (if you provided one).</p>
    </div>
  );
}
