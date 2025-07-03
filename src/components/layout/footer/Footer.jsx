import React from 'react';
import styles from './Footer.module.css';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import logo from '../../../assets/food/logo.png';

const Footer = () => {
  return (
    <footer id="footer" className={styles.footer}>
      <div className={styles.footer2}>
        <div className={styles.top}>
        <div className={styles.column}>
          <div className={styles.brandWrap}>
            <img src={logo} alt="logo" className={styles.logo} />
            <p className={styles.text}>
              Reseptlərinizi paylaşın, ilham alın və yemək sevənlər dünyasına qoşulun.
            </p>
          </div>
        </div>

        <div className={styles.column}>
          <h4>Sayt</h4>
          <ul>
            <li><Link to="/home">Əsas</Link></li>
            <li><Link to="/my-recipes">Mənim Reseptlərim</Link></li>
            <li><Link to="/add">Resept Əlavə Et</Link></li>
            <li><Link to="/favorites">Favorilər</Link></li>
            <li><Link to="/premium">Premium</Link></li>
          </ul>
        </div>

        <div className={styles.column2}>
          <h4>Əlaqə və Məlumat</h4>
          <ul>
            <li><Link to="/about">Haqqımızda</Link></li>
            <li><Link to="/contact">Bizimlə Əlaqə</Link></li>
          </ul>
          <div className={styles.socials}>
            <a href="https://www.facebook.com/share/1FEL8uUEkM/" target="_blank" rel="noreferrer">
              <FaFacebookF />
            </a>
            <a href="https://www.instagram.com/aliyevha_xatira?igsh=czM4bDd3NThlOXhi" target="_blank" rel="noreferrer">
              <FaInstagram />
            </a>
            <a href="https://wa.me/994515364622" target="_blank" rel="noreferrer">
              <FaWhatsapp />
            </a>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>© 2025 Reseptmatik — Yemək sevərlərin rəqəmsal mətbəxi.</p>
      </div>
      </div>
    </footer>
  );
};

export default Footer;
