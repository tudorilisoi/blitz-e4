import { Category } from "@prisma/client"
import React, { Suspense } from "react"
import { FORM_ERROR, Form, FormProps } from "src/core/components/Form"
import { LabeledTextField } from "src/core/components/LabeledTextField"

import { z } from "zod"
export { FORM_ERROR } from "src/core/components/Form"

type ExtendedFormProps<S extends z.ZodType<any, any>> = FormProps<S> & {
  categories: Category[]
}

export function PostForm<S extends z.ZodType<any, any>>(props: ExtendedFormProps<S>) {
  const values: any = props.initialValues
  console.log("V", values)
  return (
    <Form<S> {...props}>
      {/* template: <__component__ name="__fieldName__" label="__Field_Name__" placeholder="__Field_Name__"  type="__inputType__" /> */}
      <LabeledTextField label="title" name="title" type="text" />
      <LabeledTextField as="textarea" rows={10} label="body" name="body" />
      <LabeledTextField label="price" name="price" type="number" />
      <LabeledTextField label="currency" name="currency" type="text" />
      <LabeledTextField as="select" label="category" name="categoryId" type="number">
        <option key={-1} value="">
          Selectaţi o categorie
        </option>
        {props.categories.map((c: Category) => {
          return (
            <option selected={values?.categoryId === c.id} key={c.id} value={c.id}>
              {c.title}
            </option>
          )
        })}
      </LabeledTextField>
    </Form>
  )
}
