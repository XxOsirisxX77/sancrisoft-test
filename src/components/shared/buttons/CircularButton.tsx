import EditIcon from '../icons/EditIcon'
import TrashIcon from '../icons/TrashIcon'
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
  const buttonIntentClass =
    props.icon === Icon.EDIT ? styles.edit : styles.delete
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
        {props.icon === Icon.EDIT ? <EditIcon /> : <TrashIcon />}
      </button>
    </>
  )
}

export default CircularButton
