import { Toast } from 'models/Toast.model'
import { createContext } from 'react'

type ToastContextProp = {
  toasts: Toast[]
  sendSuccess?: (toast: Toast) => void
  sendWarning?: (toast: Toast) => void
  sendError?: (toast: Toast) => void
}

const ToastContext = createContext<ToastContextProp>({
  toasts: [],
  sendSuccess: () => {},
  sendWarning: () => {},
  sendError: () => {}
})

export default ToastContext
