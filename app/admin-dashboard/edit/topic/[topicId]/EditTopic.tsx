"use client"

import { Answer, Question } from "@/app/student-dashboard/attempts/[attemptId]/types"
import { Topic, TopicType } from "@/app/student-dashboard/types"
import Card from "@/components/Card"
import Input from "@/components/Input"
import SectionCard from "@/components/SectionCard"
import { useState } from "react"
import { Switch, RadioGroup, AlertDialog, Accordion } from "radix-ui"
import { AccordionContent, AccordionTrigger } from "radix-ui/accordion"
import { ArrowLeft, ChevronUp, PlusIcon } from "lucide-react"
import { updateTopic } from "./action"
import AlertButton from "@/components/AlertButton"
import Link from "next/link"

interface EditTopicProps {
  topic: Topic
  questions: Question[]
}

const topicTypes = [
  {
    label: "Random Questions",
    value: "RANDOM_QUESTIONS"
  },
  {
    label: "Test",
    value: "TEST"
  },
  {
    label: "Quiz",
    value: "QUIZ"
  }
]

export default function EditTopic({topic: initialTopic, questions: initialQuestions} : EditTopicProps) {
  const [topic, setTopic] = useState<Topic>(initialTopic);
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [questionsOpen, setQuestionsOpen] = useState(false);
  const [questionAnswersOpen, setQuestionAnswersOpen] = useState<boolean[]>(Array(initialQuestions?.length).fill(false))
  const [updating, setUpdating] = useState(false)

  const handleTopicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = String(e.target.id)
    setTopic(topic => ({...topic, [id]: e.target.value}))
  }

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const preSplit = String(e.target.id)
    const split = preSplit.split(" ")
    const questionIndex = Number(split[1])
    const id = split[0]

    setQuestions((questions: Question[]) => {
      return questions.map((question: Question, index: number) => {
        return index == questionIndex 
        ? {...question, [id]: e.target.value}
        : question
      })
    })
  }

  const handleQuestionToggle = (
    value: boolean,
    questionIndex: number
  ) => {
    setQuestions((questions) =>
      questions.map((question, index) =>
        index === questionIndex
          ? { ...question, active: value }
          : question
      )
    );
  };

  const handleAnswerSectionOpenChange = (index: number) => {
    setQuestionAnswersOpen((questionAnswersOpen: boolean[]) => {
      const updated = [...questionAnswersOpen]
      updated[index] = !updated[index]
      return updated
    })
  }

  const handleAddQuestion = () => {
    setQuestions((questions: Question[]) => 
      [ ...questions,
        {
          id: null,
          question: "",
          points: 1,
          imageUrl: "",
          active: true,
          answers: []
        }
      ]
    )
  }

  const handleAddAnswer = (questionIndex: number) => {
    setQuestions((questions: any) => 
      questions.map((question: Question, questIndex: number) => 
        questIndex === questionIndex && question.answers.length < 5
        ? {
            ...question,
            answers: [
              ...question.answers,
              {
                id: null,
                answer: "",
                active: true,
                correct: false
              }
            ]
          }
        : question
      ) 
    )
  }

  const handleAnswerCorrectToggle = (
    value: boolean,
    questionIndex: number,
    answerIndex: number
  ) => {
    setQuestions((questions) =>
      questions.map((question, questIndex) =>
        questIndex === questionIndex
          ? {
              ...question,
              answers: question.answers.map((answer, ansIndex) =>
                ansIndex === answerIndex
                  ? {
                      ...answer,
                      correct: (value === false && answer.correct === true) ? true : value,
                    }
                  : {
                      ...answer,
                      correct: false,
                    }
              ),
            }
          : question
      )
    );
  };

  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const preSplit = String(e.target.id)
    const split = preSplit.split(" ")
    const questionIndex = Number(split[1])
    const answerIndex = Number(split[2])

    setQuestions((questions) =>
      questions.map((question, questIndex) =>
        questIndex === questionIndex 
        ?
          { ...question,
            answers: question.answers.map((answer, ansIndex) => 
              ansIndex === answerIndex
              ?
              { ...answer,
                answer: e.target.value
              }
              : answer
            )
          }
        : question
      )
    );
  }

  const handleDeleteTopic = () => {
    console.log("DELETING TOPIC")
  }

  const handleDeleteQuestion = (e: React.MouseEvent<HTMLButtonElement>) => {
    const questionId = String(e.currentTarget.id)
    console.log("Handling delete question id:", questionId)
    setQuestions((questions: any) => 
      questions.filter((question: Question) => question.id !== questionId) //Keep elements where question.id !== questionId is true otherwise remove 
    )
  }

  const handleDeleteAnswer= (e: React.MouseEvent<HTMLButtonElement>) => {
    const [questionIndex, answerId] = String(e.currentTarget.id).split(" ")

    setQuestions((questions: any) => 
      questions.map((question: Question, questIndex: number) =>
        Number(questionIndex) === questIndex
        ?
        { 
          ...question,
          answers:  question.answers.filter((answer: Answer) => answer.id !== answerId)
        } 
        : question
      )
    )
  }

  return(
    <div className="py-20 max-w-5xl flex mx-auto px-4">
      <SectionCard>
        <Link
          href={`/admin-dashboard`}
          className="mb-4 group inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-600 shadow-sm transition-all duration-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 active:scale-95"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
          Back to dashboard
        </Link>
        <Card>
          <div className="space-y-6">
            <div className="flex justify-between w-full">
              <AlertButton
                name="Topic"
                onClick={handleDeleteTopic}
              />
              {/* TOGGLE TOPIC ACTIVE */}
              <div className="flex items-center justify-end">
                <label
                  id="isActive"
                  htmlFor="isActive"
                  className="pr-[15px] text-md "
                >
                  Topic active
                </label>

                <Switch.Root
                  id="isActive"
                  aria-labelledby="isActive"
                  className="h-5 w-10 rounded-full bg-gray-300 relative data-[state=checked]:bg-blue-600"
                  checked = {topic.active}
                  onCheckedChange={(checked) =>
                    setTopic({
                      ...topic,
                      active: checked,
                    })
                  }
                >
                  <Switch.Thumb className="block h-4 w-4 rounded-full bg-white shadow transition-transform translate-x-0.5 data-[state=checked]:translate-x-[22px]" />
                </Switch.Root>
              </div>
            </div>
            <Input handleInputChange={handleTopicChange} value={topic.name} name="name" label="Topic name"/>
            <Input handleInputChange={handleTopicChange} value={topic.description} name="description" label="Topic Description" />
            <div>
              <p className="text-sm text-gray-700/75">Topic Type</p>
              <RadioGroup.Root
                className="flex flex-col gap-3"
                id="default"
                aria-labelledby="view-density"
                value={topic.topicType}
                onValueChange={(value: TopicType) => {
                  setTopic((prev: any) => ({
                    ...prev,
                    topicType: value,
                  }));
                }}
              >
                {topicTypes.map((topic, index) => (
                  <div key={topic.label} className="flex items-center gap-2">
                    <RadioGroup.Item
                      className="h-5 w-5 rounded-full border border-blue-300 bg-white outline-none focus:ring-2 focus:ring-blue-500 data-[state=checked]:border-blue-600 shadow-lg"
                      value={topic.value}
                      id={"topicType" + index}
                    >
                      <RadioGroup.Indicator className="flex items-center justify-center">
                        <div className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                      </RadioGroup.Indicator>
                    </RadioGroup.Item>
                    <label htmlFor={"topicType" + index} className="text-gray-700">
                      {topic.label}
                    </label>
                  </div>
                ))}
              </RadioGroup.Root>
            </div>
            {topic.topicType === "RANDOM_QUESTIONS" && <Input handleInputChange={handleTopicChange} value={topic.questionPoolSize?.toString() || "1"} name="questionPoolSize" label="Question pool size" />}
            <div className="flex flex-col text-gray-700">
              <label
                htmlFor="dueDate"
                className="text-sm text-gray-700/75"
              >
                Due Date
              </label>

              <div className="bg-blue-100 border-blue-300 border rounded px-2 py-1 focus-within:outline focus-within:outline-2 focus-within:outline-blue-500">
                <input
                  type="datetime-local"
                  id="dueDate"
                  name="dueDate"
                  value={topic.dueDate ?? ""}
                  onChange={(e) =>
                    setTopic((prev) => ({
                      ...prev,
                      dueDate: e.target.value,
                    }))
                  }
                  className="focus:outline-none w-full"
                />
              </div>
            </div>
          </div>
        </Card>

        <Accordion.Root
          type="multiple"
          onValueChange={() => setQuestionsOpen(!questionsOpen)}
          className="mt-4"
        >
          <Accordion.Item
            value="questions"
            className="overflow-hidden rounded-lg border border-blue-200 bg-white"
          >
            <AccordionTrigger
              className="flex w-full cursor-pointer items-center justify-between px-4 py-3
                        text-left transition-colors hover:bg-blue-50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100">
                  <span className="text-blue-700">?</span>
                </div>

                <div>
                  <p className="font-medium text-gray-800">
                    Show Questions
                  </p>
                  <p className="text-sm text-gray-500">
                    View and edit the questions for this topic
                  </p>
                </div>
              </div>

              <ChevronUp
                className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
                  questionsOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </AccordionTrigger>

            <AccordionContent className="border-t border-blue-100 px-4 py-4 space-y-4">
              {questions.map((question: Question, questionIndex: number) => (
                <Card key={question.id || "" + questionIndex}>
                  <div className="max-w-sm mb-4">
                    <AlertButton
                      name="question"
                      onClick={handleDeleteQuestion}
                      id = {question.id}
                    />
                  </div>
                  <div className="space-y-2">
                    <Input value={question.question} name = {`question ${questionIndex}`} handleInputChange={(e) => handleQuestionChange(e)} label="Question" />
                    <Input value={question.points.toString()} name={`points ${questionIndex}`} handleInputChange={(e) => handleQuestionChange(e)} label="Points" />
                    <Input value={question.imageUrl} name={`imageUrl ${questionIndex}`} handleInputChange={(e) => handleQuestionChange(e)} label="Image Url" />
                    <div className="flex items-center justify-start">
                      <label
                        id="active"
                        htmlFor="isActive"
                        className="pr-[15px] text-md "
                      >
                        Question active
                      </label>

                      <Switch.Root
                        id="active"
                        aria-labelledby="active"
                        className="h-5 w-10 rounded-full bg-gray-300 relative data-[state=checked]:bg-blue-600"
                        checked = {question.active}
                        onCheckedChange={(e) => handleQuestionToggle(e, questionIndex)}
                      >
                        <Switch.Thumb className="block h-4 w-4 rounded-full bg-white shadow transition-transform translate-x-0.5 data-[state=checked]:translate-x-[22px]" />
                      </Switch.Root>
                    </div>
                    <p className="mt-4">Answers:</p>
                    <Accordion.Root 
                      type="multiple" 
                      className="mt-4"
                      onValueChange={() => handleAnswerSectionOpenChange(questionIndex)}
                    >
                      <Accordion.Item
                        value={`answers-${questionIndex}`}
                        className="overflow-hidden rounded-lg border border-gray-100 shadow bg-white"
                      >
                        <AccordionTrigger className="flex w-full cursor-pointer items-center justify-between px-4 py-3 text-left transition-colors hover:bg-gray-200 bg-gray-200/30">
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-800">
                              Answers
                            </span>
                            <span className="text-sm text-gray-500">
                              {question.answers.length} answer
                              {question.answers.length !== 1 ? "s" : ""}
                            </span>
                          </div>

                          <ChevronUp className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${questionAnswersOpen[questionIndex] ? "rotate-0" : 'rotate-180'}`} />
                        </AccordionTrigger>

                        <AccordionContent className="border-t border-blue-100 px-4 py-4 space-y-4">
                          {question.answers.map(
                            (answer: Answer, answerIndex: number) => (
                              <Card theme="gray">
                                
                                <div
                                  key={answer.id|| "" + answerIndex}
                                  className="mb-4 last:mb-0 space-y-4"
                                >
                                  <Input
                                    value={answer.answer}
                                    name={`answer ${questionIndex} ${answerIndex}`}
                                    label="Answer"
                                    handleInputChange={(e) =>
                                      handleAnswerChange(
                                        e
                                      )
                                    }
                                  />
                                  <div className="flex flex-col md:flex-row md:justify-between items-center">
                                    <div className="flex items-center justify-start">
                                      <label
                                        htmlFor={`correct-${questionIndex}-${answerIndex}`}
                                        className="pr-[15px] text-md"
                                      >
                                        Is correct
                                      </label>

                                      <Switch.Root
                                        id={`correct-${questionIndex}-${answerIndex}`}
                                        aria-label={`Mark answer ${answerIndex + 1} as correct`}
                                        className="relative h-5 w-10 rounded-full bg-gray-300 data-[state=checked]:bg-blue-600"
                                        checked={answer.correct ?? false}
                                        onCheckedChange={(checked) =>
                                          handleAnswerCorrectToggle(
                                            checked,
                                            questionIndex,
                                            answerIndex
                                          )
                                        }
                                      >
                                        <Switch.Thumb className="block h-4 w-4 translate-x-0.5 rounded-full bg-white shadow transition-transform data-[state=checked]:translate-x-[22px]" />
                                      </Switch.Root>
                                    </div>

                                    <div className="max-w-sm">
                                      <AlertButton
                                        name="answer"
                                        theme="red-text"
                                        onClick={handleDeleteAnswer}
                                        id = {`${questionIndex} ${answer.id}`}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </Card>
                            )
                          )}
                          <button
                            type="button"
                            className="mx-auto flex w-1/2 max-w-xl cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow-md active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none disabled:hover:bg-gray-300 disabled:active:scale-100 disabled:focus:ring-0"
                            onClick={() => handleAddAnswer(questionIndex)}
                            disabled={question.answers.length > 4}
                          >
                            <PlusIcon className="h-5 w-5" />
                            <span>Add Answer</span>
                          </button>
                        </AccordionContent>
                      </Accordion.Item>
                    </Accordion.Root>
                  </div>
                </Card>
              ))}
              <button
                type="button"
                className="mx-auto flex w-1/2 max-w-xl cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow-md active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={handleAddQuestion}
              >
                <PlusIcon className="h-5 w-5" />
                <span>Add Question</span>
              </button>
            </AccordionContent>
            
          </Accordion.Item>
          
        </Accordion.Root>
        <div className="flex mx-auto w-md justify-center mt-4">
          <AlertButton
            name="topic"
            theme="regular"
            onClick={() => updateTopic(topic.id, topic, questions)}
          />
        </div>
      </SectionCard>
    </div>
  )
}