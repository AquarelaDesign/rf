import { useState } from 'react'

const useModalRotas = () => {
  const [isShowRotas, setIsShowRotas] = useState(false)

  function toggleRotas() {
    setIsShowRotas(!isShowRotas)
  }

  return {
    isShowRotas,
    toggleRotas,
  }
}

export default useModalRotas