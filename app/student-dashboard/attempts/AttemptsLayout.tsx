"use client"

import { ArrowLeft, Hash, Heart, Trophy } from "lucide-react";
import { Topic } from "../types";
import { Attempt } from "./types"
import { redirect } from "next/navigation";
import { createAttempt } from "./actions";

interface AttemptLayoutProps {
  attempts: Attempt[];
  topic: Topic;
}

export default function AttemptsLayout({attempts, topic}: AttemptLayoutProps) {
  const handleCreateAttempt = async () => {
    const attemptId = await createAttempt(topic.id)
    redirect(`/student-dashboard/attempts/${attemptId}`)
  }

  let greatestScore = -1
  attempts.map((attempt: Attempt) => {
    if (attempt.percentage > greatestScore) {
      greatestScore = attempt.percentage
    }
  })

  return (
  <div className="px-4 py-8">
    {/*<h1 className="flex w-full justify-center pt-20 text-4xl font-bold text-white">
      Name: {topic.name}
    </h1>*/}

    <div className="mx-auto flex w-full max-w-3xl flex-col">
      <div className="rounded-lg bg-blue-100 px-8 py-6 text-gray-800 shadow-xl">
        <button 
        onClick={() => {
            redirect("/student-dashboard")
        }}
        className="flex items-center text-blue-500 gap-1 cursor-pointer hover:text-blue-700"
        >
          <ArrowLeft className="w-8 h-8"/> Back to Dashboard
        </button>

        <div className="py-5 border-b border-blue-200 flex max-w-sm justify-between mx-auto">
          <div
            className={`flex flex-col items-center p-2 rounded-xl border ${
              greatestScore === -1
                ? "bg-gray-200 border-gray-400 text-gray-800"
                : greatestScore * 100 < 65
                ? "bg-red-200 border-red-400 text-red-800"
                : greatestScore * 100 < 80
                ? "bg-yellow-200 border-yellow-400 text-yellow-800"
                : greatestScore * 100 < 90
                ? "bg-blue-200 border-blue-400 text-blue-800"
                : "bg-green-200 border-green-400 text-green-800"
            }`}
          >
            <Trophy />
            <p className="font-semibold">Best Score</p>
            <p className="font-semibold">
              {greatestScore === -1
                ? "N/A"
                : `${(greatestScore * 100).toFixed(2)}%`}
            </p>
          </div>

          <div className="flex flex-col items-center bg-blue-200 p-2 rounded-xl text-blue-800 border border-blue-400">
            <Hash className="text-blue-700" />
            <p className="font-semibold">Attempts</p>
            <p className="font-semibold">{attempts.length}</p>
          </div>
        </div>

        <h2 className="mt-6 mb-3 text-sm font-semibold uppercase tracking-wide text-gray-700">
          Attempts
        </h2>

        <div className="space-y-3">
          {
            attempts.length == 0 ? 
            <p className="text-black/50">No active attempts</p>
            :
            <>
              {attempts.map((attempt, index) => (
                <div
                  key={attempt.id}
                  className="flex md:flex-row flex-col md:space-y-0 space-y-4 items-center justify-between rounded-lg border border-blue-300 bg-white px-4 py-4 shadow-sm"
                >
                  <div className="flex flex-1 items-center gap-3">
                    <div className="rounded bg-blue-500 px-3 py-2 text-sm font-semibold text-white">
                      Attempt #{index + 1}
                    </div>

                    <div className="rounded bg-gray-100 px-3 py-2 text-sm">
                      <span className="font-semibold">Points:</span>{" "}
                      {attempt.pointsEarned} / {attempt.totalPoints}
                    </div>

                    <div className="rounded bg-gray-100 px-3 py-2 text-sm">
                      <span className="font-semibold">Percentage:</span>{" "}
                      {(attempt.percentage * 100).toFixed(2)}%
                    </div>
                  </div>

                  <a
                    href={`/student-dashboard/attempts/${attempt.id}`}
                    type="button"
                    className="ml-4 rounded bg-blue-500 px-3 py-2 text-sm font-medium text-white hover:bg-blue-600"
                  >
                    Continue Attempt
                  </a>
                </div>
              ))}
            </>
          }
        </div>

        <div className="mt-6 flex justify-center border-t border-blue-200 pt-5">
          <button
            type="button"
            className="rounded bg-blue-500 px-5 py-2 font-medium text-white hover:bg-blue-600"
            onClick={handleCreateAttempt}
          >
            Start New Attempt
          </button>
        </div>
      </div>
    </div>
  </div>
)
}