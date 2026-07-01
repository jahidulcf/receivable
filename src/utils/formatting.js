export const formatCurrency = (amount, useEnglish = true) => {
  if (amount === null || amount === undefined) return '०'
  
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)

  if (!useEnglish) {
    return convertTobengaliNumerals(formatted)
  }
  return formatted
}

export const convertTobengaliNumerals = (str) => {
  const bengaliDigits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९']
  return str.replace(/\d/g, (digit) => bengaliDigits[parseInt(digit)])
}

export const formatDate = (dateString, language = 'en') => {
  const date = new Date(dateString)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const dateOnly = date.toDateString()
  const todayOnly = today.toDateString()
  const yesterdayOnly = yesterday.toDateString()

  if (dateOnly === todayOnly) {
    return language === 'bn' ? 'আজ' : 'Today'
  }
  if (dateOnly === yesterdayOnly) {
    return language === 'bn' ? 'গতকাল' : 'Yesterday'
  }

  return date.toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export const getBackupFileName = () => {
  const date = new Date()
  const dateStr = date.toISOString().split('T')[0]
  return `receivable-backup-${dateStr}.json`
}

export const isBackupOlderThan7Days = (backupDate) => {
  if (!backupDate) return true
  const backup = new Date(backupDate)
  const now = new Date()
  const days = (now - backup) / (1000 * 60 * 60 * 24)
  return days > 7
}