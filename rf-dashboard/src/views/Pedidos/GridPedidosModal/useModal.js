import { useState } from 'react'

const useModal = () => {
  const [isShowPedido, setIsShowPedido] = useState(false)

  function toggleGridPedidos() {
    setIsShowPedido(!isShowPedido)
  }

  return {
    isShowPedido,
    toggleGridPedidos,
  }
}

export default useModal