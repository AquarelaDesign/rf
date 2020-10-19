import { useState } from 'react'

const useModal = () => {
  const [isShowUser, setIsShowUser] = useState(false)

  function toggleUser() {
    setIsShowUser(!isShowUser)
  }

  return {
    isShowUser,
    toggleUser,
  }
}

export default useModal