const VERSION = 'v1'
const KEYS = {
  COMPANY: `receivable:${VERSION}:company`,
  CUSTOMERS: `receivable:${VERSION}:customers`,
  TRANSACTIONS: `receivable:${VERSION}:transactions`,
  UI_STATE: `receivable:${VERSION}:ui`,
  BACKUP_META: `receivable:${VERSION}:backupMeta`,
}

export const storageService = {
  loadAll: () => {
    try {
      return {
        company: JSON.parse(localStorage.getItem(KEYS.COMPANY)),
        customers: JSON.parse(localStorage.getItem(KEYS.CUSTOMERS)) || [],
        transactions: JSON.parse(localStorage.getItem(KEYS.TRANSACTIONS)) || [],
        uiState: JSON.parse(localStorage.getItem(KEYS.UI_STATE)) || {},
        backupMeta: JSON.parse(localStorage.getItem(KEYS.BACKUP_META)),
      }
    } catch (error) {
      console.error('Error loading storage:', error)
      return {
        company: null,
        customers: [],
        transactions: [],
        uiState: {},
        backupMeta: null,
      }
    }
  },

  saveCompany: (company) => {
    try {
      localStorage.setItem(KEYS.COMPANY, JSON.stringify(company))
    } catch (error) {
      console.error('Error saving company:', error)
    }
  },

  saveCustomers: (customers) => {
    try {
      localStorage.setItem(KEYS.CUSTOMERS, JSON.stringify(customers))
    } catch (error) {
      console.error('Error saving customers:', error)
    }
  },

  saveTransactions: (transactions) => {
    try {
      localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(transactions))
    } catch (error) {
      console.error('Error saving transactions:', error)
    }
  },

  saveUIState: (uiState) => {
    try {
      localStorage.setItem(KEYS.UI_STATE, JSON.stringify(uiState))
    } catch (error) {
      console.error('Error saving UI state:', error)
    }
  },

  saveBackupMeta: (backupMeta) => {
    try {
      localStorage.setItem(KEYS.BACKUP_META, JSON.stringify(backupMeta))
    } catch (error) {
      console.error('Error saving backup meta:', error)
    }
  },

  clearAll: () => {
    try {
      Object.values(KEYS).forEach(key => localStorage.removeItem(key))
    } catch (error) {
      console.error('Error clearing storage:', error)
    }
  },
}