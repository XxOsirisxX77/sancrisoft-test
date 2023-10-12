import { CTAIcon } from '../buttons/CircularButton'

type CTAButtonIconProps = {
  ctaButtonIcon?: CTAIcon
}

const CTAButtonIcon = (props: CTAButtonIconProps) => {
  return (
    <>
      {props.ctaButtonIcon === CTAIcon.EDIT && <i className="pi pi-pencil"></i>}
      {props.ctaButtonIcon === CTAIcon.DELETE && (
        <i className="pi pi-trash"></i>
      )}
    </>
  )
}

export default CTAButtonIcon
