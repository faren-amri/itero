// src/components/common/Card.jsx
import React from 'react';
import shared from '../../styles/shared/Shared.module.css';
import styles from '../../styles/components/MotivationDashboard.module.css'; // or wherever .card lives

const Card = ({ title, children }) => {
  return (
    <div className={styles.card}>
      {title && <h3 className={shared.cardTitle}>{title}</h3>}
      <div className={shared.cardBody}>{children}</div>
    </div>
  );
};

export default Card;
