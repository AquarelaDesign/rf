import { useState } from 'react'

const useModal = () => {
  const [isShowUsuario, setIsShowing] = useState(false)

  function toggleUsuario() {
    setIsShowing(!isShowUsuario)
  }

  return {
    isShowUsuario,
    toggleUsuario,
  }
}

export default useModal