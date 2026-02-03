import React from 'react';
import styles from './Button.module.css';

export interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant: 'number' | 'operator' | 'function' | 'scientific' | 'equals' | 'control';
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant,
  disabled = false,
  className = '',
  ariaLabel,
}) => {
  const variantClass = variant === 'control' ? styles.function : styles[variant];
  const combinedClassName = `${styles.button} ${variantClass} ${className}`.trim();

  return (
    <button
      type="button"
      className={combinedClassName}
      onClick={onClick}
      disabled={disabled}
      tabIndex={0}
      aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
    >
      {children}
    </button>
  );
};

export default Button;
