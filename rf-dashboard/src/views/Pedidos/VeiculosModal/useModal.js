import { useState } from 'react'

const useModalVeiculos = () => {
  const [isShowVeiculos, setIsShowVeiculos] = useState(false)

  function toggleVeiculos() {
    setIsShowVeiculos(!isShowVeiculos)
  }

  return {
    isShowVeiculos,
    toggleVeiculos,
  }
}

export default useModalVeiculos