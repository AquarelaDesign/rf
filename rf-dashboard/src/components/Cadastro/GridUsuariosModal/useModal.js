import { useState } from 'react'

const useModal = () => {
  const [isShowing, setIsShowing] = useState(false)

  function toggleGridUsuarios() {
    setIsShowing(!isShowing)
  }

  return {
    isShowing,
    toggleGridUsuarios,
  }
}

export default useModal