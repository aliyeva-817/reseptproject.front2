import { useEffect, useState } from 'react';
import axiosInstance from '../../services/axiosInstance';
import styles from './Payments.module.css';
import { MdOutlinePayments } from 'react-icons/md';

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
    <div className={styles.container}>
      

      {payments.length === 0 ? (
        <div className={styles.emptyBox}>
          <MdOutlinePayments size={60} className={styles.emptyIcon} />
          <p className={styles.emptyText}>Hələlik heç bir ödəniş yoxdur</p>
        </div>
      ) : (
        <div className={styles.paymentGrid}>
          {payments.map((p) => (
            <div className={styles.card} key={p._id}>
              <div className={styles.username}>{p.user?.username}</div>
              <div className={styles.recipe}>{p.recipe?.title}</div>
              <div className={styles.amount}>{p.amount} ₼</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Payments;
