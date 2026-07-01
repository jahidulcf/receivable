import React from 'react'

export const Toast = ({ message, isVisible }) => {
  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 right-4 bg-neutral-900 text-white px-4 py-3 rounded shadow-lg z-50 animate-pulse">
      {message}
    </div>
  )
}

export default Toast