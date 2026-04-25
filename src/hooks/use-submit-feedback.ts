"use client"

import { useMutation } from "@tanstack/react-query"
import { submitFeedback, uploadFileToS3 } from "@/lib/api"
import type { FeedbackFormValues } from "@/lib/validations/feedback"

export function useSubmitFeedback() {
  return useMutation({
    mutationFn: async (values: FeedbackFormValues) => {
      let fileKey: string | undefined

      if (values.file) {
        const uploadResult = await uploadFileToS3(values.file)
        fileKey = uploadResult.fileKey
      }

      return submitFeedback({
        name: values.name,
        email: values.email,
        message: values.message,
        fileKey,
      })
    },
  })
}