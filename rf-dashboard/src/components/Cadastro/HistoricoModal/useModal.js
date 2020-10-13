import { useState } from 'react'

const useModalHistorico = () => {
  const [isShowHistorico, setIsShowHistorico] = useState(false)

  function toggleHistorico() {
    setIsShowHistorico(!isShowHistorico)
  }

  return {
    isShowHistorico,
    toggleHistorico,
  }
}

export default useModalHistorico