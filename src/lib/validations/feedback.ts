import { z } from "zod"

export const MAX_FILE_SIZE = 5 * 1024 * 1024

export const feedbackSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters"),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address"),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters"),
  file: z
    .instanceof(File)
    .refine(file => file.type === "application/pdf", "Only PDF files are allowed")
    .refine(file => file.size <= MAX_FILE_SIZE, "File must be 5MB or less")
    .optional(),
})

export type FeedbackFormValues = z.infer<typeof feedbackSchema>