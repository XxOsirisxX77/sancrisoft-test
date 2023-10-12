import { FunctionComponent, PropsWithChildren, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { Toast as ToastModel, ToastType } from 'src/models/Toast.model'
import Toast from './Toast'
import ToastContext from 'src/contexts/ToastContext'
import styles from './toast.module.css'

const ToastContextProvider: FunctionComponent<PropsWithChildren> = ({
  children
}) => {
  const [toasts, setToasts] = useState<ToastModel[]>([])

  const sendSuccess = (toast: ToastModel) => {
    open({ ...toast, type: ToastType.SUCCESS })
  }

  const sendWarning = (toast: ToastModel) => {
    open({ ...toast, type: ToastType.WARNING })
  }

  const sendError = (toast: ToastModel) => {
    open({ ...toast, type: ToastType.ERROR })
  }

  const open = (toast: ToastModel) => {
    setToasts((currentToasts) => [
      ...currentToasts,
      { ...toast, id: new Date().getUTCMilliseconds() }
    ])
  }

  const onClose = (id: number) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id)
    )
  }

  const contextValue = useMemo(
    () => ({ toasts: [], sendSuccess, sendWarning, sendError }),
    []
  )

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {createPortal(
        <div role="group" className={styles.toastsContainer}>
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              onClose={() => onClose(toast.id!)}
              toast={toast}
            />
          ))}
        </div>,
        document.getElementById('toast-container') as HTMLElement
      )}
    </ToastContext.Provider>
  )
}

export default ToastContextProvider
