import React from 'react';
import { clsx } from 'clsx';

const Input = ({ label, error, className, ...props }) => {
  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="block text-sm font-medium text-text-muted px-1">
          {label}
        </label>
      )}
      <input 
        className={clsx(
          'input-field',
          error && 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/10',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-400 px-1">{error}</p>
      )}
    </div>
  );
};

export default Input;
