import { hashService } from './hashService'

export const backupService = {
  createBackup: (company, customers, transactions) => {
    const backup = {
      version: 1,
      backupDate: new Date().toISOString(),
      company,
      customers,
      transactions,
    }

    const hash = hashService.generateHash(backup)
    
    return {
      ...backup,
      hash,
    }
  },

  exportBackup: (backup) => {
    return JSON.stringify(backup, null, 2)
  },

  importBackup: (backupString) => {
    try {
      return JSON.parse(backupString)
    } catch (error) {
      throw new Error('Invalid backup file format')
    }
  },

  verifyBackup: (backup) => {
    const { hash, ...data } = backup
    return hashService.verifyHash(data, hash)
  },

  downloadBackup: (backup, filename = 'receivable-backup.json') => {
    const dataStr = backupService.exportBackup(backup)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
  },
}