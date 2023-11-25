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
  console.log(`🚀 ~ PasswordField ~ props:`, props)
  const [visible, setvisible] = useState(false)

  const { Tag, tagProps } = props
  let cn = tagProps.className || ""
  cn = `${cn} join-item`
  cn = `input join-item bordered border-r-0`
  const newProps = {
    ...tagProps,
    type: visible ? "text" : "password",
    className: cn,
  }

  const input = <Tag {...newProps} />
  const Icon = visible ? EyeSlashIcon : EyeIcon

  return (
    <div className="join w-fit group bordered focus-within:border-2">
      {input}
      <div
        className=" btn btn-ghost join-item border-l-2  bordered"
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
    tag = <PasswordField Tag={Tag} tagProps={tprops} />
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
