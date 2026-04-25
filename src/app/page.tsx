import { FeedbackForm } from "@/components/feedback/feedback-form"

export default function HomePage() {
  return (
    <main className="min-h-screen w-full overflow-hidden bg-[#08030d] text-white">
      <section className="relative flex min-h-screen items-center justify-center px-4 py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.35),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.25),transparent_35%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-size-[64px_64px] opacity-25" />

        <div className="relative z-10 w-full max-w-2xl">
          <FeedbackForm />
        </div>
      </section>
    </main>
  )
}