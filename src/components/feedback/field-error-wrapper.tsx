import { AnimatePresence, motion } from "framer-motion"

type FieldErrorWrapperProps = {
  children: React.ReactNode
  error?: string
}

export function FieldErrorWrapper({ children, error }: FieldErrorWrapperProps) {
  return (
    <div className="space-y-2">
      {children}

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