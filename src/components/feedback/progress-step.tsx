import { motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"

type ProgressStepProps = {
  label: string
  active: boolean
  done: boolean
}

export function ProgressStep({ label, active, done }: ProgressStepProps) {
  return (
    <div className="flex items-center gap-3 text-white/55">
      <div className="flex h-5 w-5 items-center justify-center rounded-full border border-white/15 bg-white/4">
        {done ? (
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
        ) : active ? (
          <motion.div
            className="h-2 w-2 rounded-full bg-white"
            animate={{ opacity: [0.35, 1, 0.35], scale: [1, 1.4, 1] }}
            transition={{ repeat: Infinity, duration: 1.1 }}
          />
        ) : (
          <div className="h-1.5 w-1.5 rounded-full bg-white/25" />
        )}
      </div>

      <span className={done ? "text-white" : active ? "text-white/80" : ""}>
        {label}
      </span>
    </div>
  )
}