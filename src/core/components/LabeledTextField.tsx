import { forwardRef, PropsWithoutRef, ComponentPropsWithoutRef, Ref } from "react"
import { useFormContext } from "react-hook-form"
import { ErrorMessage } from "@hookform/error-message"

export const FieldDefaultAsType = "input" as const
export type FieldDefaultAsType = typeof FieldDefaultAsType

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
  const Tag = as || FieldDefaultAsType

  const {
    register,
    formState: { isSubmitting, errors },
  } = useFormContext()

  console.log("Form errors", errors)

  return (
    <div {...outerProps}>
      <label {...labelProps}>
        {label}
        <Tag disabled={isSubmitting} {...register(name)} {...otherProps}>
          {children}
        </Tag>
      </label>

      <ErrorMessage
        render={({ message }) => (
          <div role="alert" style={{ color: "red" }}>
            {message}
          </div>
        )}
        errors={errors}
        name={name}
      />

      <style jsx>{`
        label {
          display: flex;
          flex-direction: column;
          align-items: start;
          font-size: 1rem;
          /* width: 100%; */
        }
        input[type="text"],
        textarea {
          width: 100%;
        }
        input,
        textarea {
          font-size: 1rem;
          padding: 0.25rem 0.5rem;
          border-radius: 3px;
          border: 1px solid purple;
          appearance: none;
          margin-top: 0.5rem;
        }
      `}</style>
    </div>
  )
}
export const LabeledTextField = forwardRef<React.ElementType, any>((props, ref) => {
  return <LabeledTextFieldInner {...{ ...props, ref }} />
})
