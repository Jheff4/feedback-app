import { AnimatePresence, motion } from "framer-motion"
import { FileText, UploadCloud, X } from "lucide-react"
import { Label } from "@/components/ui/label"

type FeedbackFileUploadProps = {
  file?: File
  error?: string
  disabled?: boolean
  onChange: (file?: File) => void
  onRemove: () => void
}

export function FeedbackFileUpload({
  file,
  error,
  disabled,
  onChange,
  onRemove,
}: FeedbackFileUploadProps) {
  return (
    <div className="space-y-3">
      <Label className="text-white">PDF attachment</Label>

      <motion.label
        htmlFor="file"
        whileHover={{ scale: disabled ? 1 : 1.01 }}
        whileTap={{ scale: disabled ? 1 : 0.99 }}
        className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.035] px-6 py-8 text-center transition hover:border-white/30 hover:bg-white/6"
      >
        <input
          id="file"
          type="file"
          accept="application/pdf"
          disabled={disabled}
          className="sr-only"
          onChange={event => onChange(event.target.files?.[0])}
        />

        <div className="mb-3 rounded-full bg-white/[0.07] p-3 text-white transition group-hover:bg-white/10">
          <UploadCloud className="h-6 w-6" />
        </div>

        <p className="text-sm font-medium text-white">Click to upload a PDF</p>
        <p className="mt-1 text-xs text-white/40">Maximum file size: 5MB</p>
      </motion.label>

      <AnimatePresence>
        {file && (
          <motion.div
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -6, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/4 px-4 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="rounded-lg bg-white/[0.07] p-2">
                  <FileText className="h-5 w-5 text-white/70" />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">
                    {file.name}
                  </p>
                  <p className="text-xs text-white/40">
                    {(file.size / 1024 / 1024).toFixed(2)}MB
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={disabled}
                onClick={onRemove}
                className="rounded-full p-1 text-white/45 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-sm text-red-300"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}