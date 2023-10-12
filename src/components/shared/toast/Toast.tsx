import styles from './toast.module.css'
import { Toast as ToastModel, ToastType } from '../../../models/Toast.model'
import ToastIcon from '../icons/ToastIcon'

const TOAST_DURATION = 3000

type ToastContextProp = {
  toast: ToastModel
  onClose: () => void
}

const Toast = (props: ToastContextProp) => {
  setTimeout(() => props.onClose(), TOAST_DURATION)
  let toastTypeClass
  switch (props.toast.type) {
    case ToastType.SUCCESS:
      toastTypeClass = styles.toastSuccess
      break
    case ToastType.WARNING:
      toastTypeClass = styles.toastWarning
      break
    case ToastType.ERROR:
      toastTypeClass = styles.toastError
      break
  }

  return (
    <div
      role="alertdialog"
      aria-describedby="toast-message"
      className={[styles.toast, toastTypeClass].join(' ')}
    >
      <ToastIcon toastType={props.toast.type} />
      <div id="toast-message" role="alert">
        {props.toast.message}
      </div>
    </div>
  )
}

export default Toast
