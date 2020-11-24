import { useState } from 'react'

const useModalAddRota = () => {
  const [isShowAddRota, setIsShowAddRota] = useState(false)

  function toggleAddRota() {
    setIsShowAddRota(!isShowAddRota)
  }

  return {
    isShowAddRota,
    toggleAddRota,
  }
}

export default useModalAddRota