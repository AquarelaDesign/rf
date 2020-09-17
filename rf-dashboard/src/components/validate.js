export const validateCPF = cpf => {
  let sum = 0
  let rest
  cpf = cpf.replace(/\D/g, "")

  if (/^(\d)\1+$/.test(cpf)) return false
  for (let i = 1; i <= 9; i++)
    sum = sum + parseInt(cpf.substring(i - 1, i), 10) * (11 - i)
  rest = (sum * 10) % 11

  if (rest === 10 || rest === 11) rest = 0
  if (rest !== parseInt(cpf.substring(9, 10), 10)) return false

  sum = 0
  for (let i = 1; i <= 10; i++)
    sum = sum + parseInt(cpf.substring(i - 1, i), 10) * (12 - i)
  rest = (sum * 10) % 11

  if (rest === 10 || rest === 11) rest = 0
  if (rest !== parseInt(cpf.substring(10, 11), 10)) return false
  return true
};

export const validateCNPJ = cnpj => {
  let size = 0
  let nums = 0
  cnpj = cnpj.replace(/\D/g, "")

  if (cnpj === "") return false

  if (cnpj.length !== 14) return false

  // Elimina CNPJs invalidos conhecidos
  if (/^(\d)\1+$/.test(cnpj)) return false

  // Valida DVs
  size = cnpj.length - 2;
  nums = cnpj.substring(0, size)
  let digits = cnpj
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
  if (result !== digits[0]) return false

  size = size + 1
  nums = cnpj.substring(0, size)
  sum = 0
  pos = size - 7
  for (let i = size; i >= 1; i--) {
    sum += nums.charAt(size - i) * pos--
    if (pos < 2) pos = 9
  }
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (result !== digits[1]) return false

  return true
}
