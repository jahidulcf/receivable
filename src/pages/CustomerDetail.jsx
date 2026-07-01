import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useStore } from '../stores/store'
import Header from '../components/Header'
import TransactionList from '../components/TransactionList'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import EmptyState from '../components/EmptyState'
import Button from '../components/Button'
import Toast from '../components/Toast'
import { formatCurrency, formatDate } from '../utils/formatting'
import { t } from '../utils/i18n'
import { validateAmount } from '../utils/validation'

export const CustomerDetail = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { customers, transactions, addTransaction, updateTransaction, deleteTransaction, deleteCustomer, uiState } = useStore()
  const language = uiState.language || 'en'

  const customer = customers.find(c => c.id === id)
  const customerTransactions = transactions.filter(t => t.customerId === id).sort((a, b) => new Date(b.date) - new Date(a.date))
  
  const outstanding = customerTransactions.reduce((sum, t) => {
    return sum + (t.type === 'DUE' ? t.amount : -t.amount)
  }, 0)

  const [showTransactionModal, setShowTransactionModal] = useState(false)
  const [transactionType, setTransactionType] = useState('DUE')
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [formData, setFormData] = useState({ amount: '', date: new Date().toISOString().split('T')[0], note: '' })
  const [errors, setErrors] = useState({})
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [toast, setToast] = useState({ message: '', visible: false })

  if (!customer) {
    return <EmptyState title="Customer not found" message="This customer does not exist." action={{ label: 'Back', onClick: () => navigate('/') }} />
  }

  const handleOpenTransactionModal = (type, transaction = null) => {
    setTransactionType(type)
    if (transaction) {
      setEditingTransaction(transaction)
      setFormData({
        amount: transaction.amount.toString(),
        date: transaction.date,
        note: transaction.note || '',
      })
    } else {
      setEditingTransaction(null)
      setFormData({ amount: '', date: new Date().toISOString().split('T')[0], note: '' })
    }
    setErrors({})
    setShowTransactionModal(true)
  }

  const validateTransactionForm = () => {
    const newErrors = {}
    
    if (!validateAmount(formData.amount)) {
      newErrors.amount = t('amount_required', language)
    }
    
    if (!formData.date) {
      newErrors.date = t('date', language) + ' required'
    } else if (new Date(formData.date) > new Date()) {
      newErrors.date = 'Cannot be future date'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSaveTransaction = () => {
    if (!validateTransactionForm()) return

    const transactionData = {
      customerId: customer.id,
      type: transactionType,
      amount: parseFloat(formData.amount),
      date: formData.date,
      note: formData.note.trim(),
    }

    if (editingTransaction) {
      updateTransaction(editingTransaction.id, transactionData)
    } else {
      addTransaction(transactionData)
    }

    setShowTransactionModal(false)
    setToast({ message: editingTransaction ? 'Transaction updated' : 'Transaction added', visible: true })
    setTimeout(() => setToast({ ...toast, visible: false }), 2000)
  }

  const handleDeleteCustomer = () => {
    deleteCustomer(customer.id)
    navigate('/')
  }

  const handleShareStatement = () => {
    const statement = `${t('customer_detail', language)}: ${customer.name}\n${t('outstanding', language)}: ৳${formatCurrency(outstanding)}\n${t('last_updated', language)}: ${formatDate(new Date(), language)}`
    
    if (navigator.share) {
      navigator.share({
        title: 'Account Statement',
        text: statement,
      })
    } else {
      navigator.clipboard.writeText(statement)
      setToast({ message: t('copied', language), visible: true })
      setTimeout(() => setToast({ ...toast, visible: false }), 2000)
    }
  }

  return (
    <div className="bg-neutral-50 min-h-screen pb-20">
      <Header
        title={customer.name}
        subtitle={customer.phone}
        actions={[
          { label: t('back', language), onClick: () => navigate('/'), variant: 'ghost' }
        ]}
      />

      <div className="px-4 py-6 space-y-6">
        {/* Outstanding Balance */}
        <div className="bg-white border border-neutral-200 rounded-lg p-6">
          <p className="text-neutral-600 text-sm mb-2">{t('outstanding', language)}</p>
          <h2 className="text-4xl font-bold text-neutral-900">৳ {formatCurrency(outstanding)}</h2>
        </div>

        {/* Address */}
        {customer.address && (
          <div className="px-4 py-3 bg-neutral-100 rounded text-sm text-neutral-600">
            {customer.address}
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button onClick={() => handleOpenTransactionModal('DUE')} className="w-full">
            {t('add_due', language)}
          </Button>
          <Button onClick={() => handleOpenTransactionModal('PAYMENT')} className="w-full" variant="secondary">
            {t('payment', language)}
          </Button>
        </div>

        {/* Transactions */}
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">{t('transactions', language)}</h3>
          {customerTransactions.length === 0 ? (
            <EmptyState
              title={t('no_transactions', language)}
              message={t('no_transactions', language)}
            />
          ) : (
            <TransactionList
              transactions={customerTransactions}
              language={language}
              onEdit={(transaction) => handleOpenTransactionModal(transaction.type, transaction)}
              onDelete={(transactionId) => {
                if (window.confirm('Delete this transaction?')) {
                  deleteTransaction(transactionId)
                }
              }}
            />
          )}
        </div>

        {/* Share & Delete */}
        <div className="space-y-2 pt-4">
          <Button onClick={handleShareStatement} className="w-full" variant="secondary">
            {t('share_statement', language)}
          </Button>
          <Button onClick={() => setShowDeleteConfirm(true)} className="w-full" variant="danger">
            {t('delete', language)}
          </Button>
        </div>
      </div>

      {/* Transaction Modal */}
      <Modal
        isOpen={showTransactionModal}
        title={editingTransaction ? t('edit', language) : (transactionType === 'DUE' ? t('add_due', language) : t('payment', language))}
        onClose={() => setShowTransactionModal(false)}
        onSave={handleSaveTransaction}
        saveText={t('save', language)}
        cancelText={t('cancel', language)}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-1">
              {t('amount', language)}
            </label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="0"
              className={`w-full px-4 py-2 border rounded text-sm focus:outline-none ${
                errors.amount ? 'border-red-300' : 'border-neutral-300'
              }`}
            />
            {errors.amount && <p className="text-red-600 text-xs mt-1">{errors.amount}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-1">
              {t('date', language)}
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className={`w-full px-4 py-2 border rounded text-sm focus:outline-none ${
                errors.date ? 'border-red-300' : 'border-neutral-300'
              }`}
            />
            {errors.date && <p className="text-red-600 text-xs mt-1">{errors.date}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-1">
              {t('note', language)}
            </label>
            <textarea
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-neutral-300 rounded text-sm focus:outline-none"
            />
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title={t('confirm_delete', language)}
        message={outstanding > 0 ? `Outstanding: ৳${formatCurrency(outstanding)}. Delete anyway?` : 'Delete this customer?'}
        confirmText={t('delete', language)}
        cancelText={t('cancel', language)}
        isDanger={true}
        onConfirm={handleDeleteCustomer}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      <Toast message={toast.message} isVisible={toast.visible} />
    </div>
  )
}

export default CustomerDetail