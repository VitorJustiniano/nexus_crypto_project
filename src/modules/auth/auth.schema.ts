import { z } from 'zod'

export const RegisterSchema = z.object({
  name: z.string().min(2),
  email: z.string().check(z.email()),
  password: z.string().min(6),
})

export const LoginSchema = z.object({
  email: z.string().check(z.email()),
  password: z.string().min(6),
})