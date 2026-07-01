import React from 'react'

export const EmptyState = ({ icon, title, message, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {icon && <div className="text-4xl mb-4">{icon}</div>}
      <h3 className="text-lg font-medium text-neutral-900 mb-2">{title}</h3>
      <p className="text-neutral-500 text-sm mb-6 max-w-sm">{message}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="min-h-44 min-w-44 px-6 py-3 bg-neutral-900 text-white rounded font-medium hover:bg-neutral-800 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}

export default EmptyState