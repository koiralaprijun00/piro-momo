'use client';
import React from 'react';

interface GameButtonProps {
  onClick?: () => void;
  type?: 'primary' | 'secondary' | 'success' | 'danger' | 'neutral' | 'grayNeutral' | 'text';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

/**
 * GameButton - A reusable button component for games
 *
 * @param onClick - Function to call when button is clicked
 * @param type - Button style variant (primary, secondary, success, danger, neutral, text)
 * @param size - Button size (sm, md, lg)
 * @param fullWidth - Whether the button should take full width of its container
 * @param disabled - Whether the button is disabled
 * @param children - Content inside the button
 * @param className - Additional CSS classes
 */
const GameButton: React.FC<GameButtonProps> = ({
  onClick,
  type = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  children,
  className = '',
}) => {
  // Styles mapped by type
  const typeStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600',
    secondary: 'bg-purple-600 hover:bg-purple-700 text-white border-purple-600',
    success: 'bg-green-500 hover:bg-green-600 text-white border-green-500',
    danger: 'bg-red-500 hover:bg-red-600 text-white border-red-500',
    neutral: 'bg-gray-200 hover:bg-gray-300 text-gray-800 border-gray-300',
    grayNeutral: 'bg-blue-200 hover:bg-gray400 text-gray-800 border-1 focus:border-blue-600 hover:text-bold border-gray-300',
    text: 'bg-transparent hover:bg-transparent text-gray-500 hover:text-gray-700 hover:text-blue-600 border-transparent hover:underline text-sm',
  };

  // Styles mapped by size
  const sizeStyles = {
    sm: 'text-sm py-1 px-3',
    md: 'text-base py-2 px-4',
    lg: 'text-lg py-3 px-6',
  };

  // Width style
  const widthStyle = fullWidth ? 'w-full' : '';

  // Disabled style
  const disabledStyle = disabled 
    ? 'opacity-60 cursor-not-allowed'
    : 'transform hover:scale-105 active:scale-100';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${typeStyles[type]}
        ${sizeStyles[size]}
        ${widthStyle}
        ${disabledStyle}
        font-medium rounded-lg transition-all duration-200
        border
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default GameButton;