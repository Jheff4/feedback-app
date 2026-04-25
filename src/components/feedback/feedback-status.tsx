import { AnimatePresence, motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"

type FeedbackStatusProps = {
  mutation: {
    isSuccess: boolean
    isError: boolean
    error: unknown
  }
}

export function FeedbackStatus({ mutation }: FeedbackStatusProps) {
  return (
    <AnimatePresence mode="wait">
      {mutation.isSuccess && (
        <motion.div
          key="success"
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0 }}
          className="flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-200"
        >
          <CheckCircle2 className="h-4 w-4" />
          Feedback submitted successfully.
        </motion.div>
      )}

      {mutation.isError && (
        <motion.div
          key="error"
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0 }}
          className="rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200"
        >
          {mutation.error instanceof Error
            ? mutation.error.message
            : "Something went wrong"}
        </motion.div>
      )}
    </AnimatePresence>
  )
}