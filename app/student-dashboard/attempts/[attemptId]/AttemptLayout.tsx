"use client"

import { useEffect, useState } from "react";
import { Attempt } from "../types";
import { Answer, AttemptQuestion, Question } from "./types";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { gradeAttempt, submitAnswer } from "../actions";
import { toast } from "sonner";
import { redirect } from "next/navigation";

interface AttemptLayoutProps{
  attemptQuestionsTemp: AttemptQuestion[];
  attemptTemp: Attempt;
  topicId: string;
}

export default function AttemptLayout({attemptQuestionsTemp, attemptTemp, topicId} : AttemptLayoutProps) {
  const [attemptQuestions, setAttemptQuestions] = useState<AttemptQuestion[]>([]);
  const [attempt, setAttempt] = useState<Attempt>();
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [previouslySubmittedAnswerIds, setPreviouslySubmittedAnswerIds] =
    useState<Record<string, string | null>>({});
  
  const toastDuration = 1500;

  const playCorrectSound = () => {
    // Instantiate Audio only when the user interacts
    const audio = new Audio('/sounds/correct-answer-effect.mp3');
    
    // Optional: Adjust volume (0.0 to 1.0)
    audio.volume = 0.2; 
    
    audio.play().catch((error) => {
      console.error("Playback failed:", error);
    });
  };

  const playIncorrectSound = () => {
    // Instantiate Audio only when the user interacts
    const audio = new Audio('/sounds/incorrect-sound-effect.mp3');
    
    // Optional: Adjust volume (0.0 to 1.0)
    audio.volume = 0.2; 
    
    audio.play().catch((error) => {
      console.error("Playback failed:", error);
    });
  };

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
      if(activeQuestion + 1 < (attemptQuestions && attemptQuestions?.length || 0)){
        setActiveQuestion(activeQuestion+1)
        return
      }
      else {
        if(questionId.trim() != null && answerId.trim() != null) {
          await gradeAttempt(attempt?.id || "", topicId)
          return
        }
      }
    }
    
    const data = await submitAnswer(answerId, questionId);
    
    let isCorrect: boolean | null = null;
    if(data.data === true) {
      isCorrect = true
      playCorrectSound()
      toast.success("Correct!", {
        duration: toastDuration
      })
    }
    else if (data.data === false) {
      isCorrect = false
      playIncorrectSound()
      toast.error("Incorrect", {
        duration: toastDuration
      })
    }
    else if(typeof data.data === "string" && data.data.length > 0) {
      isCorrect = attemptQuestions && attemptQuestions[activeQuestion].isCorrect
      toast.info("Question already graded", {
        duration: toastDuration
      })
    }

    setAttemptQuestions((prevAttemptQuestions: AttemptQuestion[]) => {
      return prevAttemptQuestions?.map((attemptQuestion: AttemptQuestion) =>
        attemptQuestion.id === questionId
          ? { ...attemptQuestion, isCorrect: isCorrect }
          : attemptQuestion
      );
    });

    setPreviouslySubmittedAnswerIds((prev) => ({
      ...prev,
      [questionId]: answerId
    }))
  }

  const DisplayChoices = () => {
    const currentQuestion = attemptQuestions[activeQuestion];

    if (!currentQuestion?.question) {
      let pointsEarned = 0
      let correctCount = 0
      let unanswered = 0
      let incorrect = 0
      let totalPoints = 0

      attemptQuestions.forEach((attemptQuestion: AttemptQuestion) => {
        if(!attemptQuestion.id) return //Exclude the dummy
        totalPoints += attemptQuestion.question.points

        switch (attemptQuestion.isCorrect) {
          case true: 
            console.log("ADDING TO ATTEMPT POINTS")
            pointsEarned += attemptQuestion.question.points
            correctCount ++
            break
          case false: 
            console.log("INCREMENTING INCRORECT")
            incorrect += 1
            break
          case null:
            console.log("ADD TO UNANSWERED")
            unanswered += 1
            break          
        }
      })

      const totalQuestions = attemptQuestions.length-1;
      const percentage =
        totalPoints > 0 ? (pointsEarned / totalPoints) * 100 : 0;

      return (
        <div className="flex w-full flex-col items-center">
          <h2 className="text-3xl font-bold text-gray-800">
            Quiz Complete!
          </h2>

          <p className="mt-2 text-gray-600">
            Here's how you did.
          </p>

          {/* Score */}
          <div className="mt-4 flex flex-col items-center rounded-2xl bg-blue-50 px-12 py-8 shadow-lg">
            <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              Your Score
            </p>

            <p className="mt-2 text-5xl font-bold text-blue-700">
              {percentage.toFixed(1)}%
            </p>

            <p className="mt-2 text-gray-600">
              {pointsEarned} / {totalPoints} points
            </p>
          </div>

          {/* Statistics */}
          <div className="mt-8 grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Correct */}
            <div className="flex flex-col items-center rounded-xl border border-green-300 bg-green-50 p-5">
              <p className="text-sm font-semibold text-green-700">
                Correct
              </p>

              <p className="mt-1 text-3xl font-bold text-green-800">
                {correctCount}
              </p>

              <p className="text-sm text-green-700">
                questions
              </p>
            </div>

            {/* Incorrect */}
            <div className="flex flex-col items-center rounded-xl border border-red-300 bg-red-50 p-5">
              <p className="text-sm font-semibold text-red-700">
                Incorrect
              </p>

              <p className="mt-1 text-3xl font-bold text-red-800">
                {incorrect}
              </p>

              <p className="text-sm text-red-700">
                questions
              </p>
            </div>

            {/* Unanswered */}
            <div className="flex flex-col items-center rounded-xl border border-gray-300 bg-gray-50 p-5">
              <p className="text-sm font-semibold text-gray-600">
                Unanswered
              </p>

              <p className="mt-1 text-3xl font-bold text-gray-700">
                {unanswered}
              </p>

              <p className="text-sm text-gray-600">
                questions
              </p>
            </div>
          </div>

          {/* Question count */}
          <div className="mt-6 text-sm text-gray-500">
            {totalQuestions} total questions
          </div>
        </div>
      );
    }

    return (
      <>
        <p className="text-xl font-semibold">
          {activeQuestion + 1}. {currentQuestion.question.question}
        </p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {currentQuestion.question.answers?.map((answer: Answer) => {
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
      </>
    );
  };

  useEffect(() => {
    setAttemptQuestions([...attemptQuestionsTemp,
      { //Create this dummy which is used to show final progress
        id: "",
        isCorrect: null,
        submittedAnswerId: "",
      } as AttemptQuestion
    ])

    setAttempt(attemptTemp)
    const submittedAnswers: Record<string, string | null> = {};

    attemptQuestionsTemp.forEach((attemptQ: AttemptQuestion) => {
      submittedAnswers[attemptQ.id] = attemptQ.submittedAnswerId || null;
    });

    setPreviouslySubmittedAnswerIds(submittedAnswers);
  }, [])

  const leftArrowDisabled = activeQuestion - 1 < 0
  const rightArrowDisabled = attemptQuestions && activeQuestion + 1 >= attemptQuestions.length;

  return(
    <div className="px-4 w-full justify-center items-center">
      <div className="mx-auto flex w-full max-w-3xl flex-col justify-center h-screen">
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
          
          {/* Progress bar section */}
          <div className="flex items-center gap-3 w-full max-w-md mx-auto px-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-full w-16 h-8 flex items-center justify-center border border-blue-300 shadow-md font-semibold text-sm shrink-0">
              {activeQuestion + 1 >= attemptQuestions.length ? activeQuestion : activeQuestion+1} / {attemptQuestions.length - 1}
            </div>
            <div className="flex-1">
              <div className="bg-blue-100 h-4 border border-blue-300 rounded-full overflow-hidden shadow-inner">
                <div
                  className="bg-gradient-to-r from-blue-400 to-blue-600 h-full rounded-full transition-all duration-300 shadow-sm"
                  style={{ width: `${Math.min(100, ((activeQuestion+1) / (attemptQuestions.length - 1)) * 100)}%` }}
                />
              </div>
            </div>
          </div>
          
          
          {/* Answer Display */}
          <DisplayChoices />
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
              onClick={() => {
                if(activeQuestion+1 === attemptQuestions.length)
                  redirect(`/student-dashboard/attempts?topicId=${topicId}`)
                
                handleNextClick(attemptQuestions[activeQuestion].id, attemptQuestions[activeQuestion].submittedAnswerId)
              }}
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