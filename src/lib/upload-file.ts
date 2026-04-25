export async function uploadFileToS3(file: File) {
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
    throw new Error("Failed to get upload URL")
  }

  const { uploadUrl, fileKey } = await presignResponse.json()

  const uploadResponse = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  })

  if (!uploadResponse.ok) {
    throw new Error("Failed to upload file to S3")
  }

  return { fileKey }
}