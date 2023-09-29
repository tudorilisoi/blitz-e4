import React, { Suspense } from "react"
import { FORM_ERROR, Form, FormProps } from "src/core/components/Form"
import { LabeledTextField } from "src/core/components/LabeledTextField"

import { z } from "zod"
export { FORM_ERROR } from "src/core/components/Form"

export function PostForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  console.log(props)
  return (
    <Form<S> {...props}>
      {/* template: <__component__ name="__fieldName__" label="__Field_Name__" placeholder="__Field_Name__"  type="__inputType__" /> */}
      <LabeledTextField label="title" name="title" type="text" />
      <LabeledTextField as="textarea" rows={10} label="body" name="body" />
      <LabeledTextField label="price" name="price" type="number" />
      <LabeledTextField label="currency" name="currency" type="text" />
      <LabeledTextField as="select" label="category" name="categoryId" type="number">
        <option value="19">19</option>
        <option value="21">21</option>/
      </LabeledTextField>
    </Form>
  )
}
