export const validateBDPhoneNumber = (phone) => {
  const cleaned = phone.replace(/\D/g, '')
  const withoutCountry = cleaned.startsWith('880') ? cleaned.substring(3) : cleaned
  const bdPhoneRegex = /^01[3-9]\d{8}$/
  return bdPhoneRegex.test(withoutCountry)
}

export const formatBDPhoneNumber = (phone) => {
  const cleaned = phone.replace(/\D/g, '')
  const withoutCountry = cleaned.startsWith('880') ? cleaned.substring(3) : cleaned
  return withoutCountry
}

export const validateCustomerName = (name) => {
  return name && name.trim().length >= 2 && name.trim().length <= 100
}

export const validateAmount = (amount) => {
  const num = parseFloat(amount)
  return !isNaN(num) && num > 0
}

export const validateNote = (note) => {
  return !note || note.length <= 200
}