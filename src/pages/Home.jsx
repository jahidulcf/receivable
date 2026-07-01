import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../stores/store'
import Header from '../components/Header'
import CustomerList from '../components/CustomerList'
import EmptyState from '../components/EmptyState'
import Modal from '../components/Modal'
import Button from '../components/Button'
import Toast from '../components/Toast'
import { formatCurrency } from '../utils/formatting'
import { t } from '../utils/i18n'
import { validateCustomerName, validateBDPhoneNumber, formatBDPhoneNumber } from '../utils/validation'

export const Home = () => {
  const navigate = useNavigate()
  const { company, customers, transactions, addCustomer, updateCustomer, uiState } = useStore()
  const language = uiState.language || 'en'

  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('highest')
  const [filterOutstanding, setFilterOutstanding] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' })
  const [errors, setErrors] = useState({})
  const [toast, setToast] = useState({ message: '', visible: false })

  const totalOutstanding = customers.reduce((sum, customer) => {
    const due = transactions
      .filter(t => t.customerId === customer.id && t.type === 'DUE')
      .reduce((s, t) => s + t.amount, 0)
    const paid = transactions
      .filter(t => t.customerId === customer.id && t.type === 'PAYMENT')
      .reduce((s, t) => s + t.amount, 0)
    return sum + (due - paid)
  }, 0)

  const customersWithBalance = customers.map((customer) => {
    const due = transactions
      .filter(t => t.customerId === customer.id && t.type === 'DUE')
      .reduce((s, t) => s + t.amount, 0)
    const paid = transactions
      .filter(t => t.customerId === customer.id && t.type === 'PAYMENT')
      .reduce((s, t) => s + t.amount, 0)
    return { ...customer, outstanding: due - paid }
  })

  const handleOpenModal = (customer = null) => {
    if (customer) {
      setEditingId(customer.id)
      setFormData({ name: customer.name, phone: customer.phone, address: customer.address || '' })
    } else {
      setEditingId(null)
      setFormData({ name: '', phone: '', address: '' })
    }
    setErrors({})
    setShowModal(true)
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!validateCustomerName(formData.name)) {
      newErrors.name = t('name_required', language)
    }

    if (!validateBDPhoneNumber(formData.phone)) {
      newErrors.phone = t('phone_invalid', language)
    }

    const duplicate = customersWithBalance.some(
      c => c.id !== editingId &&
        c.name.toLowerCase() === formData.name.toLowerCase() &&
        formatBDPhoneNumber(c.phone) === formatBDPhoneNumber(formData.phone)
    )
    if (duplicate) {
      newErrors.duplicate = t('duplicate_customer', language)
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSaveCustomer = () => {
    if (!validateForm()) return

    const customerData = {
      name: formData.name.trim(),
      phone: formatBDPhoneNumber(formData.phone),
      address: formData.address.trim(),
    }

    if (editingId) {
      updateCustomer(editingId, customerData)
    } else {
      addCustomer(customerData)
    }

    setShowModal(false)
    setToast({ message: editingId ? 'Customer updated' : 'Customer added', visible: true })
    setTimeout(() => setToast({ ...toast, visible: false }), 2000)
  }

  return (
    <div className="bg-neutral-50 min-h-screen pb-20">
      <Header
        title={t('app_name', language)}
        subtitle={`${t('outstanding', language)} ৳ ${formatCurrency(totalOutstanding)}`}
        actions={[
          {
            label: t('settings', language),
            onClick: () => navigate('/settings'),
            variant: 'ghost'
          }
        ]}
      />

      <div className="px-4 py-4 space-y-4">
        {/* Search */}
        <input
          type="text"
          placeholder={t('search_placeholder', language)}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border border-neutral-300 rounded text-sm focus:outline-none focus:border-neutral-900"
        />

        {/* Sort and Filter */}
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="flex-1 px-4 py-2 border border-neutral-300 rounded text-sm focus:outline-none focus:border-neutral-900"
          >
            <option value="highest">{t('highest_due_first', language)}</option>
            <option value="alphabetical">{t('alphabetical', language)}</option>
            <option value="recently_active">{t('recently_active', language)}</option>
          </select>
          <button
            onClick={() => setFilterOutstanding(!filterOutstanding)}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
              filterOutstanding
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-200 text-neutral-900 hover:bg-neutral-300'
            }`}
          >
            {t('only_outstanding', language)}
          </button>
        </div>
      </div>

      {/* Customers List */}
      {customersWithBalance.length === 0 ? (
        <EmptyState
          title={t('no_customers', language)}
          message={t('no_customers', language)}
          action={{ label: t('add_customer', language), onClick: () => handleOpenModal() }}
        />
      ) : (
        <div className="mt-4">
          <CustomerList
            customers={customersWithBalance}
            language={language}
            onSelectCustomer={(id) => navigate(`/customer/${id}`)}
            searchTerm={searchTerm}
            sortBy={sortBy}
            filterOutstanding={filterOutstanding}
          />
        </div>
      )}

      {/* Add Customer Button */}
      {customersWithBalance.length > 0 && (
        <div className="fixed bottom-6 left-4 right-4">
          <Button onClick={() => handleOpenModal()} className="w-full">
            {t('add_customer', language)}
          </Button>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={showModal}
        title={editingId ? t('edit_customer', language) : t('add_new_customer', language)}
        onClose={() => setShowModal(false)}
        onSave={handleSaveCustomer}
        saveText={t('save', language)}
        cancelText={t('cancel', language)}
      >
        <div className="space-y-4">
          {errors.duplicate && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
              {errors.duplicate}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-1">
              {t('name', language)}
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-4 py-2 border rounded text-sm focus:outline-none ${
                errors.name ? 'border-red-300' : 'border-neutral-300'
              }`}
            />
            {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-1">
              {t('phone', language)}
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="01xxxxxxxxx"
              className={`w-full px-4 py-2 border rounded text-sm focus:outline-none ${
                errors.phone ? 'border-red-300' : 'border-neutral-300'
              }`}
            />
            {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-1">
              {t('address', language)}
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-neutral-300 rounded text-sm focus:outline-none"
            />
          </div>
        </div>
      </Modal>

      <Toast message={toast.message} isVisible={toast.visible} />
    </div>
  )
}

export default Home