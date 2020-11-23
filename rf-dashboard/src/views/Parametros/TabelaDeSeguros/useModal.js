import { useState } from 'react'

const useModal = () => {
  const [isShowTabelaDeSeguros, setIsShowTabelaDeSeguros] = useState(false)

  function toggleTabelaDeSeguros() {
    setIsShowTabelaDeSeguros(!isShowTabelaDeSeguros)
  }

  return {
    isShowTabelaDeSeguros,
    toggleTabelaDeSeguros,
  }
}

export default useModal