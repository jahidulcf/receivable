import React from 'react'

export const Header = ({ title, subtitle, actions }) => {
  return (
    <div className="bg-neutral-50 border-b border-neutral-200 px-4 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">{title}</h1>
          {subtitle && <p className="text-sm text-neutral-500 mt-1">{subtitle}</p>}
        </div>
        <div className="flex gap-2">
          {actions && actions.map((action, idx) => (
            <button
              key={idx}
              onClick={action.onClick}
              className={`min-h-44 min-w-44 px-4 py-2 rounded text-sm font-medium transition-colors ${
                action.variant === 'primary'
                  ? 'bg-neutral-900 text-white hover:bg-neutral-800'
                  : action.variant === 'danger'
                  ? 'text-red-600 hover:bg-red-50'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Header