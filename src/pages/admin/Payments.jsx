// src/pages/admin/Payments.jsx
import { useEffect, useState } from 'react';
import axiosInstance from '../../services/axiosInstance';

const Payments = () => {
  const [payments, setPayments] = useState([]);

  const fetchPayments = async () => {
    try {
      const res = await axiosInstance.get('/admin/payments');
      setPayments(res.data);
    } catch (err) {
      console.error("Ödənişlər yüklənmədi:", err);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div>
      <h2>Ödənişlər</h2>
      <ul>
        {payments.map((p) => (
          <li key={p._id}>
            {p.user?.username} → {p.recipe?.title} — {p.amount} ₼
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Payments;
