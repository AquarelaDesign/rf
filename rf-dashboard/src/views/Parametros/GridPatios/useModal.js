import { useState } from 'react'

const useModal = () => {
  const [isShowGridPatios, setIsShowPatios] = useState(false)

  function toggleGridPatios() {
    setIsShowPatios(!isShowGridPatios)
  }

  return {
    isShowGridPatios,
    toggleGridPatios,
  }
}

export default useModal