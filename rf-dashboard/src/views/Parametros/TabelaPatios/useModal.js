import { useState } from 'react'

const useModalPatio = () => {
  const [isShowPatio, setIsShowPatio] = useState(false)

  function togglePatio() {
    setIsShowPatio(!isShowPatio)
  }

  return {
    isShowPatio,
    togglePatio,
  }
}

export default useModalPatio