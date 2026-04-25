import { FeedbackForm } from "@/components/feedback/feedback-form"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0b0b0c] text-white">
      <section className="relative flex min-h-screen items-center justify-center px-4 py-16">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[48px_48px]" />

        <div className="absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 bg-white/5 blur-3xl" />

        <div className="relative z-10 w-full">
          <FeedbackForm />
        </div>
      </section>
    </main>
  )
}