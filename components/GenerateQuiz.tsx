
"use client";

import { useState } from "react";
import Card from "./Card";

import { Dispatch, SetStateAction } from "react";
import { Answer, Question } from "@/app/student-dashboard/attempts/[attemptId]/types";
import { Topic } from "@/app/student-dashboard/types";
import { generateTempAnswerId, generateTempQuestionId } from "@/lib/tempId";

interface GenerateQuizProps {
  setQuestions: Dispatch<SetStateAction<Question[]>>;
  setTopic: Dispatch<SetStateAction<Topic>>;
}

export default function GenerateQuiz({setQuestions, setTopic}: GenerateQuizProps) {
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState("");

  async function handleGenerate() {
    let documentText: string | undefined;

    if (file) {
      documentText = await file.text();
    }

    const res = await fetch("/api/admin/generate-topic", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt || "Create a quiz from this document.",
        documentText,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to generate quiz");
    }

    const topic = await res.json();

    setTopic((prevTopic: Topic) => ({
      ...prevTopic,
      name: topic.name,
      description: topic.description,
    }));

    setQuestions(() => 
      topic.questions.map((question: any) => ({
        ...question,
        id: generateTempQuestionId(),
        points: 1,
        active: true,
        question: question.question,
        answers: question.answers.map((answer: any) => ({
          ...answer,
          id: generateTempAnswerId(),
          active: true,
          answer: answer.answer,
          correct: answer.isCorrect
        }))
      }))
    )

    console.log(topic);
  }

  return (
    <div className="mb-4">
      <Card>
        <input
          type="file"
          accept=".txt,text/plain,.pdf"
          onChange={(e) =>
            setFile(e.target.files?.[0] ?? null)
          }
        />

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="What kind of quiz should be generated?"
        />

        <button onClick={handleGenerate}>
          Generate quiz
        </button>
      </Card>
    </div>
  );
}