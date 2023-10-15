import { forwardRef, PropsWithoutRef, ComponentPropsWithoutRef, Ref } from "react"
import { useFormContext } from "react-hook-form"
import { ErrorMessage } from "@hookform/error-message"

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
    formState: { isSubmitting, errors },
  } = useFormContext()

  // console.log("Form errors", errors)
  const labelId = `label_${name}`

  return (
    <div {...outerProps}>
      <label {...labelProps} htmlFor={labelId}>
        {label}
      </label>
      <Tag id={labelId} disabled={isSubmitting} {...register(name)} {...otherProps}>
        {children}
      </Tag>

      <ErrorMessage
        render={({ message }) => (
          <div role="alert" style={{ color: "red" }}>
            {message}
          </div>
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
