import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../stores/store'
import Header from '../components/Header'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import Button from '../components/Button'
import { t } from '../utils/i18n'
import { isBackupOlderThan7Days, getBackupFileName } from '../utils/formatting'
import { backupService } from '../services/backupService'

export const Settings = () => {
  const navigate = useNavigate()
  const { company, customers, transactions, setCompany, setLanguage, clearAllData, setBackupMeta, backupMeta, uiState } = useStore()
  const language = uiState.language || 'en'

  const [companyForm, setCompanyForm] = useState(company || {})
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)

  const handleSaveCompany = () => {
    setCompany(companyForm)
    alert('Saved!')
  }

  const handleExportBackup = () => {
    const backup = backupService.createBackup(company, customers, transactions)
    setBackupMeta(backup)
    backupService.downloadBackup(backup, getBackupFileName())
  }

  const handleImportBackup = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const backup = backupService.importBackup(e.target.result)
        const isValid = backupService.verifyBackup(backup)

        if (!isValid) {
          alert(t('hash_mismatch', language))
          return
        }

        if (window.confirm(t('importing_will_delete', language))) {
          setCompany(backup.company)
          useStore.setState({
            customers: backup.customers,
            transactions: backup.transactions,
          })
          setBackupMeta(backup)
          alert('Backup imported successfully!')
        }
      } catch (error) {
        alert('Error importing backup: ' + error.message)
      }
    }
    reader.readAsText(file)
  }

  const handleClearAllData = () => {
    clearAllData()
    setShowClearConfirm(false)
    alert('All data cleared!')
  }

  const showBackupReminder = backupMeta && isBackupOlderThan7Days(backupMeta.backupDate)

  return (
    <div className="bg-neutral-50 min-h-screen pb-20">
      <Header
        title={t('settings', language)}
        actions={[
          { label: t('back', language), onClick: () => navigate('/'), variant: 'ghost' }
        ]}
      />

      <div className="px-4 py-6 space-y-8">
        {/* Backup Reminder */}
        {showBackupReminder && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-sm">
            {t('backup_older_than_7_days', language)}
          </div>
        )}

        {/* Company Details */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-neutral-900">{t('company_details', language)}</h2>
          
          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-1">
              {t('business_name', language)}
            </label>
            <input
              type="text"
              value={companyForm.name || ''}
              onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
              className="w-full px-4 py-2 border border-neutral-300 rounded text-sm focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-1">
              {t('phone', language)}
            </label>
            <input
              type="tel"
              value={companyForm.phone || ''}
              onChange={(e) => setCompanyForm({ ...companyForm, phone: e.target.value })}
              className="w-full px-4 py-2 border border-neutral-300 rounded text-sm focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-1">
              {t('address', language)}
            </label>
            <textarea
              value={companyForm.address || ''}
              onChange={(e) => setCompanyForm({ ...companyForm, address: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-neutral-300 rounded text-sm focus:outline-none"
            />
          </div>

          <Button onClick={handleSaveCompany} className="w-full">
            {t('save', language)}
          </Button>
        </div>

        {/* Language */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-neutral-900">{t('language', language)}</h2>
          
          <div className="flex gap-2">
            <Button
              onClick={() => setLanguage('en')}
              variant={language === 'en' ? 'primary' : 'secondary'}
              className="flex-1"
            >
              {t('english', language)}
            </Button>
            <Button
              onClick={() => setLanguage('bn')}
              variant={language === 'bn' ? 'primary' : 'secondary'}
              className="flex-1"
            >
              {t('bengali', language)}
            </Button>
          </div>
        </div>

        {/* Backup */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-neutral-900">{t('backup', language)}</h2>
          
          {backupMeta && (
            <div className="p-4 bg-neutral-100 rounded text-sm space-y-2">
              <div>
                <p className="text-neutral-600">{t('backup_date', language)}:</p>
                <p className="font-medium text-neutral-900">
                  {new Date(backupMeta.backupDate).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US')}
                </p>
              </div>
              <div>
                <p className="text-neutral-600">{t('hash', language)}:</p>
                <p className="font-mono text-neutral-900 text-xs break-all">{backupMeta.hash}</p>
              </div>
            </div>
          )}

          <Button onClick={handleExportBackup} className="w-full">
            {t('export_backup', language)}
          </Button>

          <label className="block">
            <input
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
            <Button as="span" className="w-full cursor-pointer" variant="secondary">
              {t('import_backup', language)}
            </Button>
          </label>
        </div>

        {/* Danger Zone */}
        <div className="space-y-4 pt-6 border-t border-neutral-300">
          <h2 className="text-lg font-semibold text-red-600">{t('danger_zone', language)}</h2>
          
          <Button
            onClick={() => setShowClearConfirm(true)}
            className="w-full"
            variant="danger"
          >
            {t('erase_all_data', language)}
          </Button>
        </div>
      </div>

      {/* Clear Confirmation */}
      <ConfirmDialog
        isOpen={showClearConfirm}
        title={t('confirm_delete', language)}
        message={t('erase_all_data', language)}
        confirmText={t('erase_all_data', language)}
        cancelText={t('cancel', language)}
        isDanger={true}
        onConfirm={handleClearAllData}
        onCancel={() => setShowClearConfirm(false)}
      />
    </div>
  )
}

export default Settings