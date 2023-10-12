import ButtonDirectionIcon from '../icons/ButtonDirectionIcon'
import styles from './buttons.module.css'

export enum ButtonDirection {
  LEFT,
  RIGHT
}

type ArrowButtonProps = {
  buttonDirection: number
  disabled?: boolean
  action: () => void
}

const ArrowButton = (props: ArrowButtonProps) => {
  const title = `${
    props.buttonDirection === ButtonDirection.LEFT ? 'left' : 'right'
  }-arrow`

  const ariaLabel = `${
    props.buttonDirection === ButtonDirection.LEFT ? 'Previous' : 'Next'
  } Page`

  return (
    <>
      <button
        className={[styles.button, styles.arrowButton].join(' ')}
        onClick={props.action}
        disabled={props.disabled}
        type="button"
        title={title}
        aria-label={ariaLabel}
      >
        <ButtonDirectionIcon buttonDirection={props.buttonDirection} />
      </button>
    </>
  )
}

export default ArrowButton
