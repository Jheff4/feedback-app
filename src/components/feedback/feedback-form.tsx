"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { CheckCircle2, FileText, Loader2, Send, UploadCloud, X } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useSubmitFeedback } from "@/hooks/use-submit-feedback"
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
  const mutation = useSubmitFeedback()

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

  async function onSubmit(values: FeedbackFormValues) {
    mutation.mutate(values, {
      onSuccess: () => {
        toast.success("Feedback submitted successfully")
        reset()
      },
      onError: error => {
        toast.error(error instanceof Error ? error.message : "Something went wrong")
      },
    })
  }

  return (
    <Card className="w-full max-w-2xl border-white/10 bg-white/6 shadow-2xl backdrop-blur-xl">
      <CardContent className="p-6 sm:p-8">
        <div className="mb-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm text-white/80">
            <UploadCloud className="h-4 w-4" />
            Secure feedback upload
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Send us your feedback
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-white/60">
            Share your thoughts and optionally attach a PDF. Files are uploaded
            securely to private storage before your feedback is submitted.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">
                Name
              </Label>
              <Input
                id="name"
                placeholder="Etinosa Ogbevoen"
                disabled={isPending}
                className="border-white/10 bg-white/10 text-white placeholder:text-white/35"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-red-300">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="etinosa@example.com"
                disabled={isPending}
                className="border-white/10 bg-white/10 text-white placeholder:text-white/35"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-300">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-white">
              Message
            </Label>
            <Textarea
              id="message"
              placeholder="Tell us what happened, what you expected, or what we can improve..."
              rows={6}
              disabled={isPending}
              className="resize-none border-white/10 bg-white/10 text-white placeholder:text-white/35"
              {...register("message")}
            />
            {errors.message && (
              <p className="text-sm text-red-300">{errors.message.message}</p>
            )}
          </div>

          <div className="space-y-3">
            <Label className="text-white">PDF attachment</Label>

            <label
              htmlFor="file"
              className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/4 px-6 py-8 text-center transition hover:border-white/30 hover:bg-white/8"
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

              <div className="mb-3 rounded-full bg-white/10 p-3 text-white">
                <UploadCloud className="h-6 w-6" />
              </div>

              <p className="text-sm font-medium text-white">
                Click to upload a PDF
              </p>
              <p className="mt-1 text-xs text-white/45">
                Maximum file size: 5MB
              </p>
            </label>

            {file && (
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-white/70" />
                  <div>
                    <p className="max-w-[220px] truncate text-sm font-medium text-white sm:max-w-md">
                      {file.name}
                    </p>
                    <p className="text-xs text-white/45">
                      {(file.size / 1024 / 1024).toFixed(2)}MB
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => setValue("file", undefined, { shouldValidate: true })}
                  className="rounded-full p-1 text-white/50 transition hover:bg-white/10 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {errors.file && (
              <p className="text-sm text-red-300">{errors.file.message}</p>
            )}
          </div>

          {isPending && (
            <div className="space-y-2 rounded-xl border border-white/10 bg-white/4 p-4">
              <div className="flex items-center gap-2 text-sm text-white/70">
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading file and submitting feedback...
              </div>
              <Progress value={65} />
            </div>
          )}

          {mutation.isSuccess && (
            <div className="flex items-center gap-2 rounded-xl border border-green-400/20 bg-green-400/10 p-4 text-sm text-green-200">
              <CheckCircle2 className="h-4 w-4" />
              Feedback submitted successfully.
            </div>
          )}

          {mutation.isError && (
            <div className="rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">
              {mutation.error instanceof Error
                ? mutation.error.message
                : "Something went wrong"}
            </div>
          )}

          <Button
            type="submit"
            disabled={!isValid || isPending}
            className="h-12 w-full rounded-xl bg-white text-black hover:bg-white/90"
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