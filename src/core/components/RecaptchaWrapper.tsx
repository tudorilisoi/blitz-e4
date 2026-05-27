"use client"

import dynamic from "next/dynamic"
import type { ReCAPTCHA as ReCAPTCHAType } from "react-google-recaptcha"

const ReCAPTCHA = dynamic(() => import("react-google-recaptcha").then((mod) => mod.default), {
  ssr: false,
}) as unknown as typeof ReCAPTCHAType

export type ReCAPTCHARef = ReCAPTCHAType
export default ReCAPTCHA
