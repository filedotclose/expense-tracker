import React from 'react';
import { clsx } from 'clsx';

const Card = ({ children, className, ...props }) => {
  return (
    <div 
      className={clsx('glass-card p-6 md:p-8', className)}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
