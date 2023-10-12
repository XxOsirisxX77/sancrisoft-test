import CTAButtonIcon from '../icons/CTAButtonIcon'
import styles from './buttons.module.css'

export enum CTAIcon {
  EDIT,
  DELETE
}

type CircularButtonProps = {
  icon: number
  title: string
  action: () => void
}

const CircularButton = (props: CircularButtonProps) => {
  const buttonIntentClass =
    props.icon === CTAIcon.EDIT ? styles.edit : styles.delete
  return (
    <>
      <button
        className={[
          styles.button,
          styles.circularButton,
          buttonIntentClass
        ].join(' ')}
        onClick={props.action}
        title={props.title}
        type="button"
      >
        <CTAButtonIcon ctaButtonIcon={props.icon} />
      </button>
    </>
  )
}

export default CircularButton
