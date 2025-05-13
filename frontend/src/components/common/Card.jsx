import React from 'react';
import styles from '../../styles/shared/Shared.module.css';

const Card = ({ title, children }) => {
  return (
    <div className={styles.card}>
      {title && <h3 className={styles.cardTitle}>{title}</h3>}
      {children}
    </div>
  );
};

export default Card;
