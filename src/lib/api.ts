export function uploadFileToS3WithProgress(
  file: File,
  onProgress: (progress: number) => void
): Promise<{ fileKey: string }> {
  return new Promise(async (resolve, reject) => {
    try {
      const presignResponse = await fetch(process.env.NEXT_PUBLIC_PRESIGN_API_URL!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
        }),
      })

      if (!presignResponse.ok) {
        return reject(new Error("Could not prepare file upload"))
      }

      const { uploadUrl, fileKey } = await presignResponse.json()

      const xhr = new XMLHttpRequest()

      xhr.open("PUT", uploadUrl)
      xhr.setRequestHeader("Content-Type", file.type)

      xhr.upload.onprogress = event => {
        if (!event.lengthComputable) return

        const rawPercent = Math.round((event.loaded / event.total) * 100)
        const mappedPercent = Math.round((rawPercent / 100) * 80)

        onProgress(mappedPercent)
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          onProgress(80)
          resolve({ fileKey })
          return
        }

        reject(new Error("File upload failed"))
      }

      xhr.onerror = () => reject(new Error("File upload failed"))

      xhr.send(file)
    } catch (error) {
      reject(error)
    }
  })
}

export async function submitFeedback(values: {
  name: string
  email: string
  message: string
  fileKey?: string
}) {
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
