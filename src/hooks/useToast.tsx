import ToastContext from '../contexts/ToastContext'
import { useContext } from 'react'

export const useToast = () => {
  const toastsContext = useContext(ToastContext)
  if (!toastsContext) {
    throw new Error('useToast must be used within a ToastProvider.')
  }
  toastsContext.toasts = []
  return toastsContext
}
