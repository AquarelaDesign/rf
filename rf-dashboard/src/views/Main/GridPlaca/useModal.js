import { useState } from 'react'

const useModalPlaca = () => {
  const [isShowPlaca, setIsShowPlaca] = useState(false)

  function togglePlaca() {
    setIsShowPlaca(!isShowPlaca)
  }

  return {
    isShowPlaca,
    togglePlaca,
  }
}

export default useModalPlaca