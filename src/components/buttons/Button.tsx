import SpinIcon from '../icons/SpinIcon'
import styles from './buttons.module.css'

export enum ButtonDirection {
  LEFT,
  RIGHT
}

type ButtonProps = {
  text: string
  isPrimary?: boolean
  disabled: boolean
  type?: 'button' | 'submit'
  action?: () => void
  hasProgressIcon?: boolean
  isLoading: boolean
}

const Button = ({
  isPrimary = false,
  hasProgressIcon = false,
  type = 'submit',
  ...props
}: ButtonProps) => {
  const buttonClasses = [styles.button, styles.textButton]
  if (isPrimary) {
    buttonClasses.push(styles.primaryButton)
  }

  return (
    <>
      <button
        type={type}
        className={[...buttonClasses].join(' ')}
        onClick={props.action}
        disabled={props.disabled}
      >
        {hasProgressIcon && props.isLoading ? <SpinIcon /> : null}
        {props.text}
      </button>
    </>
  )
}

export default Button
