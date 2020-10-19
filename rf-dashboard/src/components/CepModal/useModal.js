import { useState } from 'react'

const useModalCep = () => {
  const [isShowCep, setIsShowing] = useState(false)

  function toggleCep() {
    setIsShowing(!isShowCep)
  }

  return {
    isShowCep,
    toggleCep,
  }
}

export default useModalCep