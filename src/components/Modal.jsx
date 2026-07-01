import React from 'react'

export const Modal = ({ isOpen, title, children, onClose, onSave, saveText = 'Save', cancelText = 'Cancel' }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50 animate-in">
      <div className="bg-white w-full rounded-t-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-neutral-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-700 text-2xl"
          >
            ×
          </button>
        </div>
        
        <div className="mb-6 max-h-96 overflow-y-auto">
          {children}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 min-h-44 px-4 py-3 border border-neutral-300 text-neutral-900 rounded font-medium hover:bg-neutral-50 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onSave}
            className="flex-1 min-h-44 px-4 py-3 bg-neutral-900 text-white rounded font-medium hover:bg-neutral-800 transition-colors"
          >
            {saveText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Modal