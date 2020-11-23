import { useState } from 'react'

const useModal = () => {
  const [isShowTabelaDespesas, setIsShowTabelaDespesas] = useState(false)

  function toggleTabelaDespesas() {
    setIsShowTabelaDespesas(!isShowTabelaDespesas)
  }

  return {
    isShowTabelaDespesas,
    toggleTabelaDespesas,
  }
}

export default useModal