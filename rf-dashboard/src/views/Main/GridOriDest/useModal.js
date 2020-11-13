import { useState } from 'react'

const useModalOriDest = () => {
  const [isShowOriDest, setIsShowOriDest] = useState(false)

  function toggleOriDest() {
    setIsShowOriDest(!isShowOriDest)
  }

  return {
    isShowOriDest,
    toggleOriDest,
  }
}

export default useModalOriDest