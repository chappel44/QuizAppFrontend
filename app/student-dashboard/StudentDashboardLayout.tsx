"use client"

import { Section, Topic } from "./types"

type StudentDashboardLayoutProps = {
  sections: Section[] | undefined;
};


export default function StudentDashboardLayout({sections}: StudentDashboardLayoutProps) {
  console.log("SECTIONS IN STUDENT DASHBOARD LAYOUT", sections)
  return (
    <div className="px-4">
      <h1 className="flex w-full justify-center py-20 text-4xl font-bold text-white">
        Student Dashboard
      </h1>

      <div className="mx-auto flex w-full max-w-3xl flex-col space-y-4 text-gray-800">
        {sections?.map((section: Section) => (
          <div className="w-full rounded-lg bg-blue-100 px-8 py-5 shadow-xl border-blue-800">
            <h2 className="text-2xl font-semibold">{section.name}</h2>

            <p className="mt-1 text-sm text-gray-600">
              {section.description}
            </p>

            <h3 className="mt-5 mb-2 text-sm font-semibold uppercase tracking-wide text-gray-700">
              Topics
            </h3>

            <div className="space-y-8 border-l-2 border-blue-300 pl-4">
              {section.topics.map((topic: Topic) => (
                <div className="flex flex-col">
                  <div>
                    <h4 className="text-lg font-medium">{topic.name}</h4>
                    <p className="text-sm text-gray-600">{topic.description}</p>
                  </div>
                  <a
                    href={`/student-dashboard/attempts?topicId=${topic.id}`}
                    className="rounded bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 mt-2 cursor-pointer"
                  >
                    View Attempts
                  </a>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}