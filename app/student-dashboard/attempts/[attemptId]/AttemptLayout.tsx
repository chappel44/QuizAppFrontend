"use client"

import { useEffect, useState } from "react";
import { Attempt } from "../types";
import { Answer, AttemptQuestion } from "./types";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { submitAnswer } from "../actions";
import { toast } from "sonner";
import { redirect } from "next/navigation";
interface AttemptLayoutProps{
  attemptQuestionsTemp: AttemptQuestion[];
  attemptTemp: Attempt;
  topicId: string;
}

export default function AttemptLayout({attemptQuestionsTemp, attemptTemp, topicId} : AttemptLayoutProps) {
  const [attemptQuestions, setAttemptQuestions] = useState<AttemptQuestion[]>();
  const [attempt, setAttempt] = useState<Attempt>();
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [previouslySubmittedAnswerIds, setPreviouslySubmittedAnswerIds] =
    useState<Record<string, string | null>>({});

  const handleSelectAnswer = (answerId: string, questionId: string) => {
    setAttemptQuestions((prevAttemptQuestions) => {
      return prevAttemptQuestions?.map((question: AttemptQuestion) =>
        question.id === questionId
          ? { ...question, submittedAnswerId: answerId }
          : question
      );
    });
  };

  const handleNextClick = async (questionId: string, answerId: string) => {
    if(previouslySubmittedAnswerIds[questionId] === answerId) {
      if(activeQuestion + 1 < (attemptQuestions && attemptQuestions?.length || 0))
        setActiveQuestion(activeQuestion+1)
      return
    }
    
    const data = await submitAnswer(answerId, questionId);
    
    let isCorrect = null;
    console.log('DATA', data)
    if(data.data === true) {
      isCorrect = true
      toast.success("Correct!")
    }
    else if (data.data === false) {
      isCorrect = false
      toast.error("Incorrect")
    }
    else if(typeof data.data === "string" && data.data.length > 0) {
      isCorrect = attemptQuestions && attemptQuestions[activeQuestion].isCorrect
      toast.info("Question already graded")
    }

    setAttemptQuestions((prevAttemptQuestions) => {
      return prevAttemptQuestions?.map((question: AttemptQuestion) =>
        question.id === questionId
          ? { ...question, isCorrect: isCorrect }
          : question
      );
    });

    setPreviouslySubmittedAnswerIds((prev) => ({
      ...prev,
      [questionId]: answerId
    }))
  }

  useEffect(() => {
    setAttemptQuestions(attemptQuestionsTemp)
    setAttempt(attemptTemp)
    const submittedAnswers: Record<string, string | null> = {};

    attemptQuestionsTemp.forEach((attemptQ: AttemptQuestion) => {
      submittedAnswers[attemptQ.id] = attemptQ.submittedAnswerId || null;
    });

    setPreviouslySubmittedAnswerIds(submittedAnswers);
  }, [])


  // console.log("PREVIOUSLY SUBMITTED ANSWER IDS", previouslySubmittedAnswerIds)
  // console.log("ATTEMPT", attempt)
  // console.log("ATTEMPT QUESTIONS", attemptQuestions)

  const leftArrowDisabled = activeQuestion - 1 < 0
  const rightArrowDisabled = attemptQuestions && activeQuestion + 1 >= attemptQuestions.length;

  return(
    <div className="px-4">
      <h1 className="flex w-full justify-center pt-20 text-4xl font-bold text-white">
        Hello 
      </h1>

      <div className="mx-auto mt-6 flex w-full max-w-3xl flex-col">
        { attemptQuestions && 
        <div className="rounded-lg bg-blue-100 px-8 py-6 text-gray-800 shadow-xl space-y-8">
          <button 
            onClick={() => {
                redirect(`/student-dashboard/attempts?topicId=${topicId}`)
            }}
            className="flex items-center text-blue-500 gap-1 cursor-pointer hover:text-blue-700"
          >
              <ArrowLeft className="w-8 h-8"/> Back to topic
          </button>
          <p className="text-xl font-semibold ">
            {activeQuestion + 1}. {attemptQuestions[activeQuestion]?.question?.question}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {attemptQuestions[activeQuestion].question.answers.map((answer: Answer) => {
            const currentQuestion = attemptQuestions[activeQuestion];

            const isSelected =
              currentQuestion.submittedAnswerId === answer.id;

            const isCorrect = currentQuestion.isCorrect === true;
            const isIncorrect = currentQuestion.isCorrect === false;

            const borderClass =
              isSelected && isCorrect
                ? "border-green-500 bg-green-50 ring-2 ring-green-200"
                : isSelected && isIncorrect
                  ? "border-red-500 bg-red-50 ring-2 ring-red-200"
                  : isSelected
                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                    : "border-blue-200 bg-white hover:border-blue-300 hover:bg-blue-50/40";

            const textClass =
              isSelected && isCorrect
                ? "font-medium text-green-900"
                : isSelected && isIncorrect
                  ? "font-medium text-red-900"
                  : isSelected
                    ? "font-medium text-blue-900"
                    : "text-gray-800";

            const indicatorClass =
              isSelected && isCorrect
                ? "border-green-500 bg-green-500"
                : isSelected && isIncorrect
                  ? "border-red-500 bg-red-500"
                  : isSelected
                    ? "border-blue-500 bg-blue-500"
                    : "border-gray-300";

            return (
              <button
                key={answer.id}
                className={`flex w-full items-center justify-between rounded-lg border px-4 py-4 text-left transition-all ${borderClass}`}
                onClick={() =>
                  handleSelectAnswer(
                    answer.id,
                    currentQuestion.id
                  )
                }
              >
                <p className={textClass}>
                  {answer.answer}
                </p>

                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${indicatorClass}`}
                >
                  {isSelected && (
                    <div className="h-2.5 w-2.5 rounded-full bg-white" />
                  )}
                </div>
              </button>
            );
          })}
          </div>
          <div className="w-full justify-between flex">
            <button 
              className={leftArrowDisabled ? "invisible" : `rounded bg-blue-500 px-3 py-2 text-sm font-medium text-white hover:bg-blue-600 flex items-center gap-2`}
              onClick={() => setActiveQuestion(activeQuestion-1)}
              disabled = {leftArrowDisabled}
            >
              <ArrowLeft/> Prev
            </button>
            <button 
              className={`rounded bg-blue-500 px-3 py-2 text-sm font-medium text-white hover:bg-blue-600 flex items-center gap-2`}
              onClick={() => handleNextClick(attemptQuestions[activeQuestion].id, attemptQuestions[activeQuestion].submittedAnswerId)}
            >
              {activeQuestion+1 === attemptQuestions.length ? "Finish" : <div className="flex gap-2 items-center">Next <ArrowRight /></div>}
            </button>
          </div>
        </div>
        }
      </div>
    </div>
  )
}