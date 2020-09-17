const validateCPF_CNPJ = entry => {
    entry = entry.replace(/\D/g, "")
  
    if (/^(\d)\1+$/.test(entry)) return { valid: false }
  
    if (entry.length === 11) {
      let sum = 0
      let rest
      for (let i = 1; i <= 9; i++)
        sum = sum + parseInt(entry.substring(i - 1, i), 10) * (11 - i)
      rest = (sum * 10) % 11
  
      if (rest === 10 || rest === 11) rest = 0
      if (rest !== parseInt(entry.substring(9, 10), 10)) return { valid: false }
  
      sum = 0
      for (let i = 1; i <= 10; i++)
        sum = sum + parseInt(entry.substring(i - 1, i), 10) * (12 - i)
      rest = (sum * 10) % 11
  
      if (rest === 10 || rest === 11) rest = 0
      if (rest !== parseInt(entry.substring(10, 11), 10)) return { valid: false }
  
      return { valid: true, type: "CPF" }
    } else if (entry.length === 14) {
      let size = 0
      let nums = 0
      size = entry.length - 2
      nums = entry.substring(0, size)
      let digits = entry
        .substring(size)
        .split("")
        .map(d => parseInt(d, 10))
      let sum = 0
      let pos = size - 7
      for (let i = size; i >= 1; i--) {
        sum += nums.charAt(size - i) * pos--
        if (pos < 2) pos = 9
      }
      let result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
      if (result !== digits[0]) return { valid: false }
  
      size = size + 1
      nums = entry.substring(0, size)
      sum = 0
      pos = size - 7
      for (let i = size; i >= 1; i--) {
        sum += nums.charAt(size - i) * pos--
        if (pos < 2) pos = 9
      }
      result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
      if (result !== digits[1]) return { valid: false }
  
      return { valid: true, type: "CNPJ" }
    }
  
    return { valid: false }
  }
  
  export default validateCPF_CNPJ
  