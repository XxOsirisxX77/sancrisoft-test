import EditIcon from '../icons/EditIcon'
import styles from './buttons.module.css'

export enum Icon {
  EDIT,
  DELETE
}

type CircularButtonProps = {
  icon: number
  title: string
  action: () => void
}

const CircularButton = (props: CircularButtonProps) => {
  return (
    <>
      <button
        className={[styles.button, styles.circularButton].join(' ')}
        onClick={props.action}
        title={props.title}
        type="button"
      >
        <EditIcon />
      </button>
    </>
  )
}

export default CircularButton
