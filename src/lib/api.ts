import type { FeedbackFormValues } from "@/lib/validations/feedback"

export async function uploadFileToS3(file: File) {
  const response = await fetch(process.env.NEXT_PUBLIC_PRESIGN_API_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fileName: file.name,
      contentType: file.type,
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to get upload URL")
  }

  const { uploadUrl, fileKey } = await response.json()

  const uploadResponse = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  })

  if (!uploadResponse.ok) {
    throw new Error("File upload failed")
  }

  return { fileKey: fileKey as string }
}

export async function submitFeedback(
  values: Omit<FeedbackFormValues, "file"> & {
    fileKey?: string
  }
) {
  const response = await fetch(process.env.NEXT_PUBLIC_FEEDBACK_API_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  })

  if (!response.ok) {
    throw new Error("Could not submit feedback")
  }

  return response.json()
}