import { create } from 'zustand'
import { storageService } from '../services/storageService'

const generateId = () => Math.random().toString(36).substr(2, 9)

export const useStore = create((set, get) => ({
  company: null,
  customers: [],
  transactions: [],
  uiState: {},
  backupMeta: null,

  initStore: () => {
    const stored = storageService.loadAll()
    set({
      company: stored.company || {
        id: generateId(),
        name: '',
        phone: '',
        address: '',
        language: 'en',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      customers: stored.customers || [],
      transactions: stored.transactions || [],
      uiState: stored.uiState || { language: 'en' },
      backupMeta: stored.backupMeta || null,
    })
  },

  setCompany: (company) => {
    const updated = { ...company, updatedAt: new Date().toISOString() }
    set({ company: updated })
    storageService.saveCompany(updated)
  },

  addCustomer: (customer) => {
    const newCustomer = {
      ...customer,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    set((state) => ({
      customers: [...state.customers, newCustomer],
    }))
    storageService.saveCustomers(get().customers)
    return newCustomer
  },

  updateCustomer: (id, customer) => {
    const updated = { ...customer, id, updatedAt: new Date().toISOString() }
    set((state) => ({
      customers: state.customers.map((c) => (c.id === id ? updated : c)),
    }))
    storageService.saveCustomers(get().customers)
  },

  deleteCustomer: (id) => {
    set((state) => ({
      customers: state.customers.filter((c) => c.id !== id),
      transactions: state.transactions.filter((t) => t.customerId !== id),
    }))
    storageService.saveCustomers(get().customers)
    storageService.saveTransactions(get().transactions)
  },

  addTransaction: (transaction) => {
    const newTransaction = {
      ...transaction,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    set((state) => ({
      transactions: [...state.transactions, newTransaction],
    }))
    storageService.saveTransactions(get().transactions)
    return newTransaction
  },

  updateTransaction: (id, transaction) => {
    const updated = { ...transaction, id, updatedAt: new Date().toISOString() }
    set((state) => ({
      transactions: state.transactions.map((t) => (t.id === id ? updated : t)),
    }))
    storageService.saveTransactions(get().transactions)
  },

  deleteTransaction: (id) => {
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    }))
    storageService.saveTransactions(get().transactions)
  },

  setLanguage: (language) => {
    set((state) => ({
      uiState: { ...state.uiState, language },
      company: { ...state.company, language },
    }))
    storageService.saveUIState(get().uiState)
    storageService.saveCompany(get().company)
  },

  setBackupMeta: (backupMeta) => {
    set({ backupMeta })
    storageService.saveBackupMeta(backupMeta)
  },

  clearAllData: () => {
    set({
      company: {
        id: generateId(),
        name: '',
        phone: '',
        address: '',
        language: 'en',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      customers: [],
      transactions: [],
      backupMeta: null,
    })
    storageService.clearAll()
  },
}))