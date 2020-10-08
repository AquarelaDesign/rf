import { useState } from 'react'

const useModalRotasPedido = () => {
  const [isShowRotasPedido, setIsShowRotasPedido] = useState(false)

  function toggleRotasPedido() {
    setIsShowRotasPedido(!isShowRotasPedido)
  }

  return {
    isShowRotasPedido,
    toggleRotasPedido,
  }
}

export default useModalRotasPedido