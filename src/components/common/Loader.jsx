import React from "react";
import styles from "./Loader.module.css";

const Loader = () => {
  return (
    <div className={styles.loaderWrapper}>
      <div className={styles.loader}></div>
      <p>Yüklənir...</p>
    </div>
  );
};

export default Loader;
