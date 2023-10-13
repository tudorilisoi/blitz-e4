import { Category, Image, currencies } from "@prisma/client"
import React, { Suspense } from "react"
import { FORM_ERROR, Form, FormProps } from "src/core/components/Form"
import { LabeledTextField } from "src/core/components/LabeledTextField"
import UploadGrid, { BlobsChangeCallback } from "src/core/components/image/UploadGrid"

import { z } from "zod"
export { FORM_ERROR } from "src/core/components/Form"

type ExtendedFormProps<S extends z.ZodType<any, any>> = FormProps<S> & {
  categories: Category[]
  onBlobsChange?: BlobsChangeCallback
}

export function PostForm<S extends z.ZodType<any, any>>(props: ExtendedFormProps<S>) {
  const values: any = props.initialValues
  console.log("V", values)
  const labelProps = { className: "text-1xl font-bold mb-1 mt-2" }
  const outerProps = { className: "flex flex-col text-0xl" }
  const { onBlobsChange, categories, ...restProps } = props
  return (
    <Form<S> {...restProps}>
      {/* template: <__component__ name="__fieldName__" label="__Field_Name__" placeholder="__Field_Name__"  type="__inputType__" /> */}
      <UploadGrid images={values.images} onChange={onBlobsChange} />
      <LabeledTextField
        labelProps={labelProps}
        outerProps={outerProps}
        label="Titlul anunţului"
        name="title"
        type="text"
      />
      <LabeledTextField
        labelProps={labelProps}
        outerProps={outerProps}
        as="select"
        label="Categorie"
        name="categoryId"
        type="number"
      >
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
      <LabeledTextField
        labelProps={labelProps}
        outerProps={outerProps}
        as="textarea"
        rows={10}
        label="Textul anunţului"
        name="body"
      />

      {/* <LabeledTextField labelProps={labelProps} outerProps={outerProps} label="currency" name="currency" type="text" /> */}
      <div className="flex flex-row flex-wrap sm:flex-nowrap justify-start gap-2 align-top">
        <LabeledTextField
          labelProps={labelProps}
          outerProps={outerProps}
          label="Preţ"
          name="price"
          type="number"
        />
        <LabeledTextField
          labelProps={labelProps}
          outerProps={outerProps}
          as="select"
          label="Moneda"
          name="currency"
          type="number"
        >
          <option key={"noCurrency"} value="">
            {"Selectaţi ('EUR/RON')"}
          </option>
          {Object.keys(currencies).map((c: string) => {
            return (
              <option selected={values?.currency === c} key={c} value={c}>
                {c}
              </option>
            )
          })}
        </LabeledTextField>
      </div>
    </Form>
  )
}
