"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
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
import { Textarea } from "@/components/ui/textarea"
import { FeedbackHeader } from "@/components/feedback/feedback-header"
import { FeedbackFileUpload } from "@/components/feedback/feedback-file-upload"
import { FeedbackProgress } from "@/components/feedback/feedback-progress"
import { FeedbackStatus } from "@/components/feedback/feedback-status"
import { FieldErrorWrapper } from "@/components/feedback/field-error-wrapper"
import { Loader2, Send } from "lucide-react"

export function FeedbackForm() {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState<SubmitPhase>("idle")

  const mutation = useSubmitFeedback({
    onProgress: setProgress,
    onPhaseChange: setPhase,
  })

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  })

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid },
  } = form

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
    <Card className="mx-auto w-full max-w-2xl border border-white/10 bg-[#111111] shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
      <CardContent className="p-6 sm:p-8">
        <FeedbackHeader />

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

          <FeedbackFileUpload
            file={file}
            error={errors.file?.message}
            disabled={isPending}
            onChange={selectedFile =>
              setValue("file", selectedFile, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
            onRemove={() =>
              setValue("file", undefined, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
          />

          <FeedbackProgress
            visible={isPending}
            phase={phase}
            progress={progress}
          />

          <FeedbackStatus mutation={mutation} />

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
  )
}