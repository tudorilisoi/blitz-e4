import { z } from "zod"

const e = (errMessage: string) => {
  return { errorMap: () => ({ message: errMessage }) }
}

export const email = z
  .string({ ...e("Tebuie să completaţi adresa de e-mail") })
  .email()
  .transform((str) => str.toLowerCase().trim())

export const password = z
  .string({ ...e("Parola trebuie să aibă minim 6 litere/cifre") })
  .min(6)
  .max(100)
  .transform((str) => str.trim())

const validatePhone = new RegExp(/^[+]?(\d{5,12})$/)
export const Signup = z
  .object({
    email,
    password,
    passwordConfirmation: password,
    fullName: z
      .string({ ...e("Trebuie să completaţi numele dvs sau numele firmei (min. 6 litere)") })
      .min(6)
      .max(100)
      .transform((str) => str.trim()),
    phone: z
      .string({ ...e("Trebuie să completaţi nr. de telefon") })
      .refine((v) => validatePhone.test(v.trim()), "Nr. de telefon trebuie să conţină numai cifre")
      .transform((str) => str.trim()),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Parolele nu sunt la fel",
    path: ["passwordConfirmation"], // set the path of the error
  })

export const Login = z.object({
  email,
  password: password,
})

export const ForgotPassword = z.object({
  email,
})

export const ResetPassword = z
  .object({
    password: password,
    passwordConfirmation: password,
    token: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Parolele nu sunt la fel",
    path: ["passwordConfirmation"], // set the path of the error
  })

export const ChangePassword = z.object({
  currentPassword: z.string(),
  newPassword: password,
})
