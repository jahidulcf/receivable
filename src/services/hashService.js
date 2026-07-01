import CryptoJS from 'crypto-js'

export const hashService = {
  generateHash: (data) => {
    const jsonString = JSON.stringify(data)
    const hash = CryptoJS.SHA256(jsonString).toString()
    return hash.substring(0, 12).toUpperCase()
  },

  verifyHash: (data, hash) => {
    const newHash = CryptoJS.SHA256(JSON.stringify(data)).toString()
    const newHashShort = newHash.substring(0, 12).toUpperCase()
    return newHashShort === hash
  },
}