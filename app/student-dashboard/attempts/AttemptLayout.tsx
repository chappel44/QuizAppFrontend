"use client"

import { ArrowLeft } from "lucide-react";
import { Topic } from "../types";
import { Attempt } from "./types"
import { redirect } from "next/navigation";

interface AttemptLayoutProps {
  attempts: Attempt[];
  topic: Topic;
}

export default function AttemptLayout({attempts, topic}: AttemptLayoutProps){
  return (
  <div className="px-4">
    <h1 className="flex w-full justify-center pt-20 text-4xl font-bold text-white">
      Name: {topic.name}
    </h1>

    <div className="mx-auto mt-6 flex w-full max-w-3xl flex-col">
      <div className="rounded-lg bg-blue-100 px-8 py-6 text-gray-800 shadow-xl">
        {/*<p className="text-sm text-gray-600"> <span className="text-xl text-black/70 font-semibold">Name:</span> {topic.description}</p>
        <p className="text-sm text-gray-600">
          Description: {topic.description}
        </p>*/}
        <button 
        onClick={() => {
            redirect("/student-dashboard")
        }}
        className="flex items-center text-blue-500 gap-1 cursor-pointer hover:text-blue-700"
        >
          <ArrowLeft className="w-8 h-8"/> Back to Dashboard
        </button>
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
                  className="flex items-center justify-between rounded-lg border border-blue-300 bg-white px-4 py-4 shadow-sm"
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
                      {attempt.percentage}%
                    </div>
                  </div>

                  <button
                    type="button"
                    className="ml-4 rounded bg-blue-500 px-3 py-2 text-sm font-medium text-white hover:bg-blue-600"
                  >
                    Continue Attempt
                  </button>
                </div>
              ))}
            </>
          }
        </div>

        <div className="mt-6 flex justify-center border-t border-blue-200 pt-5">
          <button
            type="button"
            className="rounded bg-blue-500 px-5 py-2 font-medium text-white hover:bg-blue-600"
          >
            Start New Attempt
          </button>
        </div>
      </div>
    </div>
  </div>
)
}