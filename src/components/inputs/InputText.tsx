import styles from './input-text.module.css'

type InputTextProps = {
  fieldName: string
  type: string
  value: string | number
  required?: boolean
  focus?: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const InputText = ({
  required = true,
  focus = false,
  ...props
}: InputTextProps) => {
  const property = props.fieldName.toLowerCase()
  const field =
    props.fieldName.charAt(0).toUpperCase() + props.fieldName.slice(1)

  return (
    <>
      <div>
        <label className={styles.label} htmlFor={property}>
          {field}
        </label>
        <input
          autoFocus={focus}
          className={styles.input}
          id={property}
          type={props.type}
          value={props.value}
          onChange={props.onChange}
          required={required}
        />
      </div>
    </>
  )
}

export default InputText
