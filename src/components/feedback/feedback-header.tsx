import { ShieldCheck } from "lucide-react"

export function FeedbackHeader() {
  return (
    <div className="mb-8">
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-1 text-sm text-white/70">
        <ShieldCheck className="h-4 w-4" />
        Secure feedback upload
      </div>

      <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        Send us your feedback
      </h1>

      <p className="mt-3 max-w-xl text-sm leading-6 text-white/55">
        Share your thoughts and optionally attach a PDF. Your file is uploaded
        securely before your feedback is submitted.
      </p>
    </div>
  )
}