import LeftArrowIcon from '../icons/LeftArrowIcon'
import RightArrowIcon from '../icons/RightArrowIcon'
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
  let icon
  if (props.buttonDirection === ButtonDirection.LEFT) {
    icon = <LeftArrowIcon />
  } else {
    icon = <RightArrowIcon />
  }

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
        {icon}
      </button>
    </>
  )
}

export default ArrowButton
