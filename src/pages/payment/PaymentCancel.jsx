import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './PaymentCancel.module.css';
import GreenLoader from '../../components/common/GreenLoader'; // ✅ Loader import

const PaymentCancel = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <GreenLoader />;

  return (
    <div className={styles.container}>
      <h2>Ödəniş ləğv olundu</h2>
      <p>Yenidən cəhd etmək istəyirsiniz?.</p>
      <Link to="/premium" className={styles.button}>Geri qayıt</Link>
    </div>
  );
};

export default PaymentCancel;
