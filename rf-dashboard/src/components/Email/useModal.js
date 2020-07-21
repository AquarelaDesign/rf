import { useState } from 'react'

const useModal = () => {
  const [isShowEmail, setIsShowing] = useState(false)

  function toggleEmail() {
    setIsShowing(!isShowEmail)
  }

  return {
    isShowEmail,
    toggleEmail,
  }
}

export default useModal