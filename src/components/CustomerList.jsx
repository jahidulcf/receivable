import React from 'react'
import { formatCurrency, formatDate } from '../utils/formatting'

export const CustomerList = ({ customers, language, onSelectCustomer, searchTerm = '', sortBy = 'highest', filterOutstanding = false }) => {
  const filtered = customers.filter((customer) => {
    const matchesSearch = !searchTerm ||
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm)
    
    const hasOutstanding = filterOutstanding ? customer.outstanding > 0 : true
    
    return matchesSearch && hasOutstanding
  })

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'highest') {
      return b.outstanding - a.outstanding
    } else if (sortBy === 'alphabetical') {
      return a.name.localeCompare(b.name)
    } else if (sortBy === 'recently_active') {
      return new Date(b.updatedAt) - new Date(a.updatedAt)
    }
    return 0
  })

  return (
    <div className="divide-y divide-neutral-200">
      {sorted.map((customer) => (
        <button
          key={customer.id}
          onClick={() => onSelectCustomer(customer.id)}
          className="w-full text-left px-4 py-4 hover:bg-neutral-100 transition-colors active:bg-neutral-200"
        >
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-medium text-neutral-900">{customer.name}</h3>
            <span className="font-semibold text-neutral-900">
              ৳ {formatCurrency(customer.outstanding)}
            </span>
          </div>
          <div className="text-sm text-neutral-500 space-y-1">
            {customer.phone && <div>{customer.phone}</div>}
            {customer.address && <div>{customer.address}</div>}
          </div>
        </button>
      ))}
    </div>
  )
}

export default CustomerList