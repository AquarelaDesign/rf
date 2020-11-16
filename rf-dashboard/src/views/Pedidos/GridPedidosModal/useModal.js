import { useState } from 'react'

const useModal = () => {
  const [isShowGridPedido, setIsShowPedido] = useState(false)

  function toggleGridPedidos() {
    setIsShowPedido(!isShowGridPedido)
  }

  return {
    isShowGridPedido,
    toggleGridPedidos,
  }
}

export default useModal