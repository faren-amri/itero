import React from 'react';
import shared from '../../styles/shared/Shared.module.css';

const Card = ({ title, children }) => (
  <div className={shared.card}>
    {title && <h3 className={shared.cardTitle}>{title}</h3>}
    <div className={shared.cardBody}>{children}</div>
  </div>
);

export default Card;
