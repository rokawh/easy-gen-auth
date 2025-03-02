import React from 'react';
import { twMerge } from 'tailwind-merge';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  padding = 'md',
}) => {
  const baseStyles = 'bg-white rounded-lg shadow';

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div className={twMerge(baseStyles, paddings[padding], className)}>
      {children}
    </div>
  );
};
