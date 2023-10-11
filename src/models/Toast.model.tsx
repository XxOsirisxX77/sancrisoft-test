export enum ToastType {
  SUCCESS,
  WARNING,
  ERROR
}

export type Toast = {
  id?: number
  message: string
  type?: ToastType
}
