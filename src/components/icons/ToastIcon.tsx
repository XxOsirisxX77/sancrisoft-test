import { ToastType } from 'src/models/Toast.model'

type ToastIconProps = {
  toastType?: ToastType
}

const ToastIcon = (props: ToastIconProps) => {
  return (
    <>
      {props.toastType === ToastType.SUCCESS && <i className="pi pi-check"></i>}
      {props.toastType === ToastType.WARNING && (
        <i className="pi pi-info-circle"></i>
      )}
      {props.toastType === ToastType.ERROR && (
        <i className="pi pi-exclamation-circle"></i>
      )}
    </>
  )
}

export default ToastIcon
