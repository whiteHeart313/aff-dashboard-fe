import { z } from 'zod';
import { getPasswordSchema } from './password-schema';

const phoneRegex = new RegExp(
  /^([+]?[\\s0-9]+)?(\\d{3}|[(]?[0-9]+[)])?([-]?[\\s]?[0-9])+$/
);

export const getSignupSchema = () => {
  return z
    .object({
      name: z
        .string()
        .min(2, { message: 'Name must be at least 2 characters long.' })
        .min(1, { message: 'Name is required.' }),
      email: z
        .string()
        .email({ message: 'Please enter a valid email address.' })
        .min(1, { message: 'Email is required.' }),
      password: getPasswordSchema(), // Uses the updated password schema with direct messages
      passwordConfirmation: z.string().min(1, {
        message: 'Password confirmation is required.',
      }),
      phone: z.string().refine(value => phoneRegex.test(value), {
        message: 'Invalid phone number format',
      }),
      address: z.string().min(1, {
        message: 'Address is required.',
      }),
      accept: z.boolean().refine(val => val === true, {
        message: 'You must accept the terms and conditions.',
      }),
    })
    .refine(data => data.password === data.passwordConfirmation, {
      message: 'Passwords do not match.',
      path: ['passwordConfirmation'],
    });
};

export type SignupSchemaType = z.infer<ReturnType<typeof getSignupSchema>>;
