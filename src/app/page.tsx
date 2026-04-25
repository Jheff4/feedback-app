"use client"

import { useState } from "react"
import { uploadFileToS3 } from "@/lib/upload-file"

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null)
  const [message, setMessage] = useState("")

  async function handleUpload() {
    try {
      if (!file) {
        setMessage("Please select a PDF file")
        return
      }

      const result = await uploadFileToS3(file)

      setMessage(`Upload successful: ${result.fileKey}`)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed")
    }
  }

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Test PDF Upload</h1>

      <input
        type="file"
        accept="application/pdf"
        onChange={event => {
          setFile(event.target.files?.[0] ?? null)
        }}
      />

      <button
        type="button"
        onClick={handleUpload}
        style={{ display: "block", marginTop: "1rem" }}
      >
        Upload PDF
      </button>

      <p>{message}</p>
    </main>
  )
}