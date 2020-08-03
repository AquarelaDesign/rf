import { useState } from 'react'

const useModalConfirma = () => {
  const [isShowConfirma, setIsShowConfirma] = useState(false)

  function toggleConfirma() {
    setIsShowConfirma(!isShowConfirma)
  }

  return {
    isShowConfirma,
    toggleConfirma,
  }
}

export default useModalConfirma