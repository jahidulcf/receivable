import React from 'react'

export const Button = ({ children, onClick, variant = 'primary', disabled = false, className = '', as = 'button' }) => {
  const baseClass = 'min-h-44 min-w-44 px-4 py-2 rounded font-medium text-sm transition-colors disabled:opacity-50'
  
  const variantClass = {
    primary: 'bg-neutral-900 text-white hover:bg-neutral-800 disabled:hover:bg-neutral-900',
    secondary: 'bg-neutral-200 text-neutral-900 hover:bg-neutral-300 disabled:hover:bg-neutral-200',
    danger: 'bg-red-600 text-white hover:bg-red-700 disabled:hover:bg-red-600',
    ghost: 'text-neutral-600 hover:bg-neutral-100',
  }

  const Component = as
  
  return (
    <Component
      onClick={onClick}
      disabled={disabled}
      className={`${baseClass} ${variantClass[variant]} ${className}`}
    >
      {children}
    </Component>
  )
}

export default Button