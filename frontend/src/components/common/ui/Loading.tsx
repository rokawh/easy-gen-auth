import React from 'react';
import { twMerge } from 'tailwind-merge';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  center?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  className,
  center = false,
}) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const Spinner = () => (
    <div
      className={twMerge(
        'animate-spin rounded-full border-b-2 border-blue-600',
        sizes[size],
        className
      )}
    />
  );

  if (center) {
    return (
      <div className='flex justify-center items-center h-64'>
        <Spinner />
      </div>
    );
  }

  return <Spinner />;
};
