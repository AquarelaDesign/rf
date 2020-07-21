import React, { useCallback } from "react"
import usePortal from "react-cool-portal"

// Customize your hook based on react-cool-portal
const useModal = (options = {}) => {
  const { Portal, isShow, ...rest } = usePortal({
    ...options,
    defaultShow: false,
    internalShowHide: false,
  });

  const Modal = useCallback(
    ({ children }) => (
      <Portal>
        <div class={`modal${isShow ? " modal-open" : ""}`} tabIndex={-1}>
          {children}
        </div>
      </Portal>
    ),
    [isShow]
  )

  return { Modal, isShow, ...rest }
}

export { useModal }