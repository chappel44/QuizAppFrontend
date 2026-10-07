"use client"

import { Answer, Question } from "@/app/student-dashboard/attempts/[attemptId]/types"
import { Topic, TopicType } from "@/app/student-dashboard/types"
import Card from "@/components/Card"
import Input from "@/components/Input"
import SectionCard from "@/components/SectionCard"
import { useState } from "react"
import { Switch, RadioGroup, AlertDialog, Accordion } from "radix-ui"
import { a, label } from "framer-motion/client"
import { AccordionContent, AccordionTrigger } from "radix-ui/accordion"
import { ChevronUp } from "lucide-react"

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

  return(
    <div className="py-20 max-w-7xl flex mx-auto px-4">
      <SectionCard>
        <Card>
          <div className="space-y-6">
            <div className="flex justify-between w-full">
              <AlertDialog.Root>
                <AlertDialog.Trigger asChild>
                  <button
                    className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white
                              hover:bg-red-700 transition-colors shadow-md
                              focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Delete topic
                  </button>
                </AlertDialog.Trigger>

                <AlertDialog.Portal>
                  <AlertDialog.Overlay
                    className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                  />

                  <AlertDialog.Content
                    className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md
                    -translate-x-1/2 -translate-y-1/2
                    rounded-lg bg-white p-6 shadow-xl
                    focus:outline-none"
                  >
                    <AlertDialog.Title className="text-lg font-semibold text-gray-900">
                      Are you absolutely sure?
                    </AlertDialog.Title>

                    <AlertDialog.Description className="mt-2 text-sm leading-6 text-gray-600">
                      This action cannot be undone. This will permanently delete the topic.
                    </AlertDialog.Description>

                    <div className="mt-6 flex justify-end gap-3">
                      <AlertDialog.Cancel asChild>
                        <button
                          className="rounded-md border border-gray-300 bg-white px-4 py-2
                            text-sm font-medium text-gray-700
                            hover:bg-gray-50
                            focus:outline-none focus:ring-2 focus:ring-gray-400
                            focus:ring-offset-2"
                        >
                          Cancel
                        </button>
                      </AlertDialog.Cancel>

                      <AlertDialog.Action asChild>
                        <button
                          className="rounded-md bg-red-600 px-4 py-2
                            text-sm font-medium text-white
                            hover:bg-red-700
                            focus:outline-none focus:ring-2 focus:ring-red-500
                            focus:ring-offset-2"
                        >
                          Yes, delete topic
                        </button>
                      </AlertDialog.Action>
                    </div>
                  </AlertDialog.Content>
                </AlertDialog.Portal>
              </AlertDialog.Root>

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
                  <div className="flex items-center gap-2">
                    <RadioGroup.Item
                      className="h-5 w-5 rounded-full border border-blue-300 bg-white outline-none focus:ring-2 focus:ring-blue-500 data-[state=checked]:border-blue-600"
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
                <Card key={question.id}>
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
                        className="overflow-hidden rounded-lg border border-blue-200 bg-white"
                      >
                        <AccordionTrigger className="flex w-full cursor-pointer items-center justify-between px-4 py-3 text-left transition-colors hover:bg-blue-50">
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

                        <AccordionContent className="border-t border-blue-100 px-4 py-4">
                          {question.answers.map(
                            (answer: Answer, answerIndex: number) => (
                              <div
                                key={answer.id ?? answerIndex}
                                className="mb-4 last:mb-0"
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

                                <div className="mt-3 flex items-center justify-start">
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
                              </div>
                            )
                          )}
                        </AccordionContent>
                      </Accordion.Item>
                    </Accordion.Root>
                  </div>
                </Card>
              ))}
            </AccordionContent>
          </Accordion.Item>
        </Accordion.Root>
      </SectionCard>
    </div>
  )
}