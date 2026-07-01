import React from 'react'
import { formatCurrency, formatDate } from '../utils/formatting'
import { t } from '../utils/i18n'

export const TransactionList = ({ transactions, language, onEdit, onDelete }) => {
  const groupedByDate = transactions.reduce((acc, transaction) => {
    const date = formatDate(transaction.date, language)
    if (!acc[date]) acc[date] = []
    acc[date].push(transaction)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      {Object.entries(groupedByDate).map(([date, items]) => (
        <div key={date}>
          <h4 className="text-sm font-semibold text-neutral-600 mb-3 px-4">{date}</h4>
          <div className="divide-y divide-neutral-200">
            {items.map((transaction) => (
              <div
                key={transaction.id}
                className="px-4 py-3 flex items-start justify-between hover:bg-neutral-100 transition-colors group"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-neutral-900">
                      {transaction.type === 'DUE' ? t('due', language) : t('payment', language)}
                    </span>
                    {transaction.note && (
                      <span className="text-xs text-neutral-500">• {transaction.note}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-semibold ${
                    transaction.type === 'DUE' ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {transaction.type === 'DUE' ? '+' : '-'}৳ {formatCurrency(transaction.amount)}
                  </span>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <button
                      onClick={() => onEdit(transaction)}
                      className="text-xs px-2 py-1 text-neutral-600 hover:bg-neutral-200 rounded"
                    >
                      {t('edit', language)}
                    </button>
                    <button
                      onClick={() => onDelete(transaction.id)}
                      className="text-xs px-2 py-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      {t('delete', language)}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default TransactionList