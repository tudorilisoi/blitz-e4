import { forwardRef, PropsWithoutRef, ComponentPropsWithoutRef, Ref, useState } from "react"
import { useFormContext } from "react-hook-form"
import { ErrorMessage } from "@hookform/error-message"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"

// Default input element type
export const FieldDefaultAsTypeDefault = "input" as const
export type FieldDefaultAsType = typeof FieldDefaultAsTypeDefault

// Type for Field props
export type FieldOwnProps<E extends React.ElementType> = {
  children?: React.ReactNode
  as?: E
  name: string
  label: string
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
  labelProps?: ComponentPropsWithoutRef<"label">
}

// Password field component
export const PasswordField = (props: any) => {
  const [visible, setVisible] = useState(false)
  const { Tag, tagProps, getValues, setValue } = props
  let cn = tagProps.className || ""

  cn = `${cn} join-item px-2`

  const newProps = {
    ...tagProps,
    type: visible ? "text" : "password",
    className: cn,
  }

  if (getValues().password === "" && tagProps.name === "passwordConfirmation") {
    props.setValue("passwordConfirmation", "")
  }

  const input = <Tag {...newProps} />
  const Icon = visible ? EyeSlashIcon : EyeIcon

  return (
    <div className="join w-fit group input input-bordered px-0">
      {input}
      <div
        className="btn btn-primary join-item px-4"
        onClick={() => setVisible((prevValue) => !prevValue)}
      >
        <span>
          <Icon className="inline-block h-6" />
        </span>
      </div>
    </div>
  )
}

// Type for field props
export type FieldProps<E extends React.ElementType> = FieldOwnProps<E> &
  Omit<React.ComponentProps<E>, keyof FieldOwnProps<E>>

// Inner component
export const LabeledTextFieldInner = <E extends React.ElementType = FieldDefaultAsType>({
  children,
  as,
  label,
  outerProps,
  labelProps,
  name,
  ...otherProps
}: FieldProps<E> & { ref?: Ref<any> }) => {
  const Tag = as || FieldDefaultAsTypeDefault
  const {
    register,
    getValues,
    setValue,
    formState: { isSubmitting, errors },
  } = useFormContext()

  const labelId = `label_${name}`
  const tprops = {
    id: labelId,
    disabled: isSubmitting,
    ...register(name),
    ...otherProps,
  }

  let tag

  if (otherProps.type === "password") {
    tag = <PasswordField Tag={Tag} tagProps={tprops} getValues={getValues} setValue={setValue} />
  } else {
    tag = <Tag {...tprops}>{children}</Tag>
  }

  return (
    <div {...outerProps}>
      <label {...labelProps} htmlFor={labelId}>
        {label}
      </label>
      {tag}
      <ErrorMessage
        render={({ message }) => (
          <span
            role="alert"
            className="bg-error text-error-content mt-2 p-2 rounded-md inline-block w-fit"
          >
            {message}
          </span>
        )}
        errors={errors}
        name={name}
      />
    </div>
  )
}

// The main component with correct forwardRef typing
export const LabeledTextField = forwardRef<any, FieldProps<any>>(
  ({ name, label, ...props }, ref) => {
    return (
      <LabeledTextFieldInner
        {...props} // Spread remaining props (including outerProps, labelProps, etc.)
        name={name} // Ensure name is passed
        label={label} // Ensure label is passed
        ref={ref} // Pass ref correctly
      />
    )
  }
)
