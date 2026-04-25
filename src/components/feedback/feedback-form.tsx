"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { feedbackSchema, type FeedbackFormValues } from "@/lib/validations/feedback"

export function FeedbackForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  })

  const file = watch("file")

  const onSubmit = async (values: FeedbackFormValues) => {
    try {
      console.log(values)
      reset()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          {...register("name")}
          className="w-full rounded-md border px-3 py-2"
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          {...register("email")}
          className="w-full rounded-md border px-3 py-2"
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          rows={5}
          {...register("message")}
          className="w-full rounded-md border px-3 py-2"
        />
        {errors.message && <p className="text-sm text-red-500">{errors.message.message}</p>}
      </div>

      <div>
        <label htmlFor="file">Attachment (PDF only)</label>
        <input
          id="file"
          type="file"
          accept="application/pdf"
          onChange={event => {
            const selectedFile = event.target.files?.[0]
            setValue("file", selectedFile, { shouldValidate: true })
          }}
          className="w-full rounded-md border px-3 py-2"
        />
        {file && <p className="text-sm">{file.name}</p>}
        {errors.file && <p className="text-sm text-red-500">{errors.file.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md border px-4 py-2"
      >
        {isSubmitting ? "Submitting..." : "Submit feedback"}
      </button>
    </form>
  )
}