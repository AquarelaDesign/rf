import { useState } from 'react'

const useModal = () => {
  const [isShowPedido, setIsShowing] = useState(false)

  function togglePedido() {
    setIsShowing(!isShowPedido)
  }

  return {
    isShowPedido,
    togglePedido,
  }
}

export default useModal