import { ButtonDirection } from '../buttons/ArrowButton'

type ButtonDirectionIconProps = {
  buttonDirection?: ButtonDirection
}

const ButtonDirectionIcon = (props: ButtonDirectionIconProps) => {
  return (
    <>
      {props.buttonDirection === ButtonDirection.LEFT && (
        <i className="pi pi-angle-left"></i>
      )}
      {props.buttonDirection === ButtonDirection.RIGHT && (
        <i className="pi pi-angle-right"></i>
      )}
    </>
  )
}

export default ButtonDirectionIcon
