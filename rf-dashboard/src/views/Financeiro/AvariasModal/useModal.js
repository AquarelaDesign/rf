import { useState } from 'react'

const useModalAvarias = () => {
  const [isShowAvarias, setIsShowAvarias] = useState(false)

  function toggleAvarias() {
    setIsShowAvarias(!isShowAvarias)
  }

  return {
    isShowAvarias,
    toggleAvarias,
  }
}

export default useModalAvarias