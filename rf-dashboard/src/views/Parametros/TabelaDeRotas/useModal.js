import { useState } from 'react'

const useModal = () => {
  const [isShowTabelaDeRotas, setIsShowTabelaDeRotas] = useState(false)

  function toggleTabelaDeRotas() {
    setIsShowTabelaDeRotas(!isShowTabelaDeRotas)
  }

  return {
    isShowTabelaDeRotas,
    toggleTabelaDeRotas,
  }
}

export default useModal