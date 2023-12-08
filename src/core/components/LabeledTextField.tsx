import { forwardRef, PropsWithoutRef, ComponentPropsWithoutRef, Ref, useState } from "react"
import { useFormContext } from "react-hook-form"
import { ErrorMessage } from "@hookform/error-message"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"

export const FieldDefaultAsTypeDefault = "input" as const
export type FieldDefaultAsType = typeof FieldDefaultAsTypeDefault

export type FieldOwnProps<E extends React.ElementType> = {
  children?: React.ReactNode
  as?: E
  name: string
  /** Field label. */
  label: string
  /** Field type. Doesn't include radio buttons and checkboxes */
  // type?: "text" | "password" | "email" | "number"
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
  labelProps?: ComponentPropsWithoutRef<"label">
}

export const PasswordField = (props) => {
  const [visible, setvisible] = useState(false)

  const { Tag, tagProps, getValues } = props
  let cn = tagProps.className || ""

  cn = `${cn} join-item`
  cn = `join-item px-2`

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
        className=" btn  btn-primary join-item px-4 "
        onClick={() => setvisible((prevValue) => !prevValue)}
      >
        <span>
          <Icon className="inline-block h-6" />
        </span>
      </div>
    </div>
  )
}

export type FieldProps<E extends React.ElementType> = FieldOwnProps<E> &
  Omit<React.ComponentProps<E>, keyof FieldOwnProps<E>>

export const LabeledTextFieldInner = <E extends React.ElementType = FieldDefaultAsType>({
  children,
  as,
  label,
  outerProps,
  labelProps,
  name,
  ...otherProps
}: FieldProps<E>) => {
  const Tag = as || FieldDefaultAsTypeDefault

  const {
    register,
    getValues,
    setValue,
    formState: { isSubmitting, errors },
  } = useFormContext()

  // console.log("Form errors", errors)
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
export const LabeledTextField = forwardRef<React.ElementType, any>((props, ref) => {
  return <LabeledTextFieldInner {...{ ...props, ref }} />
})
