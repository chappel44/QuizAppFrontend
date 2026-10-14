"use client"

import { useEffect, useState } from "react"
import { ThinkingSpark } from "./ThinkingSpark"

function useDots(max = 3, interval = 450) {
  const [count, setCount] = useState(1)

  useEffect(() => {
    const id = setInterval(() => setCount((c) => (c % max) + 1), interval)
    return () => clearInterval(id)
  }, [max, interval])

  return ".".repeat(count)
}

const HINTS = [
  "Reading your request",
  "Working through the details",
  "Putting the answer together",
]

function useRotatingHint(interval = 3000) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % HINTS.length), interval)
    return () => clearInterval(id)
  }, [interval])

  return HINTS[index]
}

export function ThinkingScreen({ title = "Claude is thinking" }: { title?: string }) {
  const dots = useDots()
  const hint = useRotatingHint()

  return (
    <div className="flex w-full items-center justify-center py-12">
      <div
        role="status"
        aria-live="polite"
        className="flex w-full max-w-sm flex-col items-center gap-6 rounded-2xl border border-neutral-200 bg-white/80 px-8 py-10 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/80"
      >
        {/* Spark with soft glow */}
        <div className="relative flex items-center justify-center">
          <div className="absolute h-20 w-20 animate-pulse rounded-full bg-blue-500/20 blur-2xl motion-reduce:animate-none" />
          <ThinkingSpark size={48} />
        </div>

        {/* Title with animated dots */}
        <h1 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
          {title}
          <span aria-hidden className="inline-block w-[1.2em] text-left">
            {dots}
          </span>
        </h1>

        {/* Rotating hint */}
        <p key={hint} className="animate-fade-in text-sm text-neutral-500 dark:text-neutral-400">
          {hint}
        </p>

        {/* Indeterminate progress bar */}
        <div className="h-1 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
          <div className="h-full w-1/3 animate-slide rounded-full bg-blue-500 motion-reduce:animate-none" />
        </div>
      </div>
    </div>
  )
}