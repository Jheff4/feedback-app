import { AnimatePresence, motion } from "framer-motion"
import type { SubmitPhase } from "@/hooks/use-submit-feedback"
import { Progress } from "@/components/ui/progress"
import { ProgressStep } from "./progress-step"

type FeedbackProgressProps = {
  visible: boolean
  phase: SubmitPhase
  progress: number
}

export function FeedbackProgress({
  visible,
  phase,
  progress,
}: FeedbackProgressProps) {
  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          key="pending"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="rounded-2xl border border-white/10 bg-[#0f0f10] p-4"
        >
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-white">
                {getPhaseTitle(phase)}
              </p>
              <p className="mt-1 text-xs text-white/45">
                {getPhaseDescription(phase)}
              </p>
            </div>

            <div className="text-sm font-semibold text-white">{progress}%</div>
          </div>

          <Progress value={progress} className="h-2" />

          <div className="mt-4 space-y-3 text-xs">
            <ProgressStep
              label="Upload file"
              active={phase === "preparing" || phase === "uploading"}
              done={progress >= 80}
            />

            <ProgressStep
              label="Save feedback"
              active={phase === "saving"}
              done={progress >= 95}
            />

            <ProgressStep
              label="Send notification"
              active={phase === "notifying"}
              done={progress === 100 || phase === "complete"}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function getPhaseTitle(phase: SubmitPhase) {
  switch (phase) {
    case "preparing":
      return "Preparing your submission"
    case "uploading":
      return "Uploading attachment"
    case "saving":
      return "Saving feedback"
    case "notifying":
      return "Sending notification"
    case "complete":
      return "Submission complete"
    default:
      return "Submitting feedback"
  }
}

function getPhaseDescription(phase: SubmitPhase) {
  switch (phase) {
    case "preparing":
      return "Setting things up securely."
    case "uploading":
      return "Your PDF is being uploaded directly to private storage."
    case "saving":
      return "Your feedback is being saved."
    case "notifying":
      return "The admin notification email is being prepared."
    case "complete":
      return "Everything is done."
    default:
      return "Please keep this page open."
  }
}