import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Payment.module.css';

const PaymentCancel = () => {
  return (
    <div className={styles.container}>
      <h2>❌ Ödəniş ləğv olundu</h2>
      <p>Yenidən cəhd etmək istəyə bilərsiniz.</p>
      <Link to="/premium" className={styles.button}>Geri qayıt</Link>
    </div>
  );
};

export default PaymentCancel;
