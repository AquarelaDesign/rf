import { useState } from 'react'

const useModalDocs = () => {
  const [isShowDocs, setIsShowing] = useState(false)

  function toggleDocs() {
    setIsShowing(!isShowDocs)
  }

  return {
    isShowDocs,
    toggleDocs,
  }
}

export default useModalDocs