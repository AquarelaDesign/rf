import { useState } from 'react'

const useModal = () => {
  const [isShowing, setIsShowing] = useState(false)
  const [isUpdate, setIsUpdate] = useState(false)

  function toggle() {
    setIsShowing(!isShowing)
  }

  function toggleUpdate() {
    setIsUpdate(!isUpdate)
  }

  return {
    isShowing,
    toggle,
    isUpdate,
    toggleUpdate,
  }
}

export default useModal