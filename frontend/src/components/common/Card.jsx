// src/components/common/Card.jsx
import React from 'react';
import shared from '../../styles/shared/Shared.module.css';

const Card = ({ title, children }) => {
  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderRadius: '4px',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
      padding: '1rem',
      marginBottom: '1rem',
    }}>
      {title && <h3 style={{
        fontSize: '14px',
        fontWeight: 600,
        color: '#172b4d',
        marginBottom: '0.75rem'
      }}>{title}</h3>}
      <div>{children}</div>
    </div>
  );
};

export default Card;
