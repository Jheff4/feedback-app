"use client"

import { useMutation } from "@tanstack/react-query"
import { submitFeedback, uploadFileToS3WithProgress } from "@/lib/api"
import type { FeedbackFormValues } from "@/lib/validations/feedback"

export type SubmitPhase =
  | "idle"
  | "preparing"
  | "uploading"
  | "saving"
  | "notifying"
  | "complete"

type UseSubmitFeedbackOptions = {
  onProgress: (progress: number) => void
  onPhaseChange: (phase: SubmitPhase) => void
}

export function useSubmitFeedback({
  onProgress,
  onPhaseChange,
}: UseSubmitFeedbackOptions) {
  return useMutation({
    mutationFn: async (values: FeedbackFormValues) => {
      let fileKey: string | undefined

      onPhaseChange("preparing")
      onProgress(5)

      if (values.file) {
        onPhaseChange("uploading")

        const uploadResult = await uploadFileToS3WithProgress(
          values.file,
          onProgress
        )

        fileKey = uploadResult.fileKey
      } else {
        onProgress(80)
      }

      onPhaseChange("saving")
      onProgress(88)

      const result = await submitFeedback({
        name: values.name,
        email: values.email,
        message: values.message,
        fileKey,
      })

      onPhaseChange("notifying")
      onProgress(96)

      await new Promise(resolve => setTimeout(resolve, 400))

      onPhaseChange("complete")
      onProgress(100)

      return result
    },
  })
}