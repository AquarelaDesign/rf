import React from 'react'
import Modal from '@material-ui/core/Modal'

const closeModal = ({ onCloseModal, body, open }) => {
  console.log('Transporte-2', open, onCloseModal, body)

  return (
    <Modal
      open={open}
      onClose={onCloseModal}
      disableBackdropClick
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      {body}
    </Modal>
  )
}

export default closeModal