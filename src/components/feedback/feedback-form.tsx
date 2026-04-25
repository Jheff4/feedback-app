"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { AnimatePresence, motion } from "framer-motion"
import {
  CheckCircle2,
  FileText,
  Loader2,
  Send,
  ShieldCheck,
  UploadCloud,
  X,
} from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useSubmitFeedback, type SubmitPhase } from "@/hooks/use-submit-feedback"
import {
  feedbackSchema,
  type FeedbackFormValues,
} from "@/lib/validations/feedback"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"

export function FeedbackForm() {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState<SubmitPhase>("idle")

  const mutation = useSubmitFeedback({
    onProgress: setProgress,
    onPhaseChange: setPhase,
  })

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  })

  const file = watch("file")
  const isPending = mutation.isPending

  function onSubmit(values: FeedbackFormValues) {
    mutation.mutate(values, {
      onSuccess: () => {
        toast.success("Feedback submitted successfully")
        reset()

        setTimeout(() => {
          setProgress(0)
          setPhase("idle")
          mutation.reset()
        }, 1800)
      },
      onError: error => {
        toast.error(error instanceof Error ? error.message : "Something went wrong")
        setPhase("idle")
      },
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto w-full max-w-2xl"
    >
      <Card className="relative overflow-hidden border border-white/10 bg-[#111111] shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/30 to-transparent" />

        <CardContent className="relative p-6 sm:p-8">
          <div className="mb-8">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-1 text-sm text-white/70"
            >
              <ShieldCheck className="h-4 w-4" />
              Secure feedback upload
            </motion.div>

            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Send us your feedback
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/55">
              Share your thoughts and optionally attach a PDF. Your file is
              uploaded securely before your feedback is submitted.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <FieldErrorWrapper error={errors.name?.message}>
                <Label htmlFor="name" className="text-white">
                  Name
                </Label>
                <Input
                  id="name"
                  placeholder="Etinosa Ogbevoen"
                  disabled={isPending}
                  className="h-12 border-white/10 bg-white/6 text-white placeholder:text-white/30 focus-visible:ring-white/20"
                  {...register("name")}
                />
              </FieldErrorWrapper>

              <FieldErrorWrapper error={errors.email?.message}>
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="etinosa@example.com"
                  disabled={isPending}
                  className="h-12 border-white/10 bg-white/6 text-white placeholder:text-white/30 focus-visible:ring-white/20"
                  {...register("email")}
                />
              </FieldErrorWrapper>
            </div>

            <FieldErrorWrapper error={errors.message?.message}>
              <Label htmlFor="message" className="text-white">
                Message
              </Label>
              <Textarea
                id="message"
                placeholder="Tell us what happened, what you expected, or what we can improve..."
                rows={6}
                disabled={isPending}
                className="resize-none border-white/10 bg-white/6 text-white placeholder:text-white/30 focus-visible:ring-white/20"
                {...register("message")}
              />
            </FieldErrorWrapper>

            <div className="space-y-3">
              <Label className="text-white">PDF attachment</Label>

              <motion.label
                htmlFor="file"
                whileHover={{ scale: isPending ? 1 : 1.01 }}
                whileTap={{ scale: isPending ? 1 : 0.99 }}
                className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/3.5 px-6 py-8 text-center transition hover:border-white/30 hover:bg-white/6"
              >
                <input
                  id="file"
                  type="file"
                  accept="application/pdf"
                  disabled={isPending}
                  className="sr-only"
                  onChange={event => {
                    const selectedFile = event.target.files?.[0]
                    setValue("file", selectedFile, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }}
                />

                <div className="mb-3 rounded-full bg-white/[0.07] p-3 text-white transition group-hover:bg-white/10">
                  <UploadCloud className="h-6 w-6" />
                </div>

                <p className="text-sm font-medium text-white">
                  Click to upload a PDF
                </p>
                <p className="mt-1 text-xs text-white/40">
                  Maximum file size: 5MB
                </p>
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
                        disabled={isPending}
                        onClick={() =>
                          setValue("file", undefined, { shouldValidate: true })
                        }
                        className="rounded-full p-1 text-white/45 transition hover:bg-white/10 hover:text-white"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {errors.file && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-sm text-red-300"
                  >
                    {errors.file.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
              {isPending && (
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

                    <div className="text-sm font-semibold text-white">
                      {progress}%
                    </div>
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

            <Button
              type="submit"
              disabled={!isValid || isPending}
              className="h-12 w-full rounded-xl bg-white text-black transition hover:scale-[1.01] hover:bg-white/90 active:scale-[0.99]"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit feedback
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function FieldErrorWrapper({
  children,
  error,
}: {
  children: React.ReactNode
  error?: string
}) {
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

function ProgressStep({
  label,
  active,
  done,
}: {
  label: string
  active: boolean
  done: boolean
}) {
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