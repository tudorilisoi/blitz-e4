import { Category, Image, currencies } from "@prisma/client"
import React, { Suspense, useState } from "react"
import { FORM_ERROR, Form, FormProps } from "src/core/components/Form"
import { LabeledTextField } from "src/core/components/LabeledTextField"
import UploadGrid, { BlobsChangeCallback } from "src/core/components/image/UploadGrid"

import { z } from "zod"
export { FORM_ERROR } from "src/core/components/Form"

type ExtendedFormProps<S extends z.ZodType<any, any>> = FormProps<S> & {
  categories: Category[]
  onBlobsChange?: BlobsChangeCallback
}

// TODO consider using formik or HouseForm https://dev.to/crutchcorn/formik-works-great-heres-why-i-wrote-my-own-591m

export function PostForm<S extends z.ZodType<any, any>>(props: ExtendedFormProps<S>) {
  const values: any = props.initialValues
  // console.log("V", values)
  const labelProps = {
    className:
      "label text-secondary hover:text-accent-focus focus-within:text-primary font-bold mb-1 mt-2",
  }
  const outerProps = { className: "flex flex-col text-0xl" }
  const labelClassName = "input input-bordered bg-base-200 focus:outline-secondary-focus"
  const { onBlobsChange, categories, submitText, ...restProps } = props
  const [activeTab, setActiveTab] = useState("post")

  const grid = <UploadGrid images={values.images || []} onChange={onBlobsChange} />

  const form = (
    <>
      {/* template: <__component__ name="__fieldName__" label="__Field_Name__" placeholder="__Field_Name__"  type="__inputType__" /> */}

      <LabeledTextField
        labelProps={labelProps}
        outerProps={outerProps}
        label="Titlul anunţului"
        name="title"
        type="text"
        className={labelClassName}
      />
      <LabeledTextField
        labelProps={labelProps}
        outerProps={outerProps}
        as="select"
        label="Categorie"
        name="categoryId"
        type="number"
        className="select input-bordered bg-base-200 focus:outline-secondary-focus"
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
        className="textarea textarea-bordered bg-base-200 focus:outline-secondary-focus"
      />
      {/* <LabeledTextField labelProps={labelProps} outerProps={outerProps} label="currency" name="currency" type="text" /> */}
      <div className="flex flex-row flex-wrap sm:flex-nowrap justify-start gap-2 align-top">
        <LabeledTextField
          labelProps={labelProps}
          outerProps={outerProps}
          label="Preţ"
          name="price"
          type="number"
          className={labelClassName}
        />
        <LabeledTextField
          labelProps={labelProps}
          outerProps={outerProps}
          as="select"
          label="Moneda"
          name="currency"
          type="number"
          className="select input-bordered bg-base-200 focus:outline-secondary-focus"
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
    </>
  )
  const activeTabClass = "tab-active !bg-primary"
  const postTabClass = ` tab  !rounded-none bg-primary bg-opacity-50 ${
    activeTab === "post" ? activeTabClass : ""
  }`
  const gridTabClass = ` tab !rounded-none bg-primary bg-opacity-50  ${
    activeTab === "photos" ? activeTabClass : ""
  }`
  return (
    <Form<S> {...restProps}>
      <div className=" ">
        <div className="tabs  tabs-lg  ">
          <span className={postTabClass} onClick={() => setActiveTab("post")}>
            Anunţ
          </span>
          <span className={gridTabClass} onClick={() => setActiveTab("photos")}>
            Fotografii
          </span>
        </div>
        <div className="bordered border-[1px] rounded-lg rounded-t-none border-primary p-4  ">
          <div className={`${activeTab === "post" ? "" : "hidden"}`}>{form}</div>
          <div className={`${activeTab === "photos" ? "mt-4" : "hidden"}`}>{grid}</div>
          <button className="btn btn-lg btn-secondary btn-block mt-4">{submitText}</button>
        </div>
      </div>
    </Form>
  )
}
