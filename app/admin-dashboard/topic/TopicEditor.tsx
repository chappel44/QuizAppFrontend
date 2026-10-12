"use client"

import { Answer, Question } from "@/app/student-dashboard/attempts/[attemptId]/types"
import { Topic, TopicType } from "@/app/student-dashboard/types"
import Card from "@/components/Card"
import Input from "@/components/Input"
import SectionCard from "@/components/SectionCard"
import { useEffect, useRef, useState } from "react"
import { Switch, RadioGroup, Tabs, Accordion } from "radix-ui"
import { AccordionContent, AccordionTrigger } from "radix-ui/accordion"
import { ArrowLeft, CheckIcon, ChevronUp, PlusIcon } from "lucide-react"
import { deleteTopic, updateTopic } from "@/lib/topic"
import AlertButton from "@/components/AlertButton"
import Link from "next/link"
import { toast } from "sonner"
import { useRouter, useSearchParams } from "next/navigation";
import { Sidebar } from "@/components/SideBar"

interface EditTopicProps {
  topic?: Topic
  questions?: Question[]
  sectionId?: string
}

const topicTypes = [
  {
    label: "Quiz",
    value: "QUIZ"
  },
  {
    label: "Test",
    value: "TEST"
  },
  {
    label: "Random Questions",
    value: "RANDOM_QUESTIONS"
  }
]

export default function TopicEditor({topic: initialTopic, questions: initialQuestions, sectionId} : EditTopicProps) {
  const [topic, setTopic] = useState<Topic>(
    initialTopic || {
      id: "",
      createdAt: "",
      name: "",
      description: "",
      dueDate: "",
      active: true,
      topicType: "QUIZ",
      questions: [],
      questionPoolSize: 1,
      section: sectionId || "",
    }
  );

  const [questions, setQuestions] = useState<Question[]>(initialQuestions || []);
  const [selectedTab, setSelectedTab] = useState<"topic" | "questions">("topic");
  const [questionNavigationOpen, setQuestionNavigationOpen] = useState(selectedTab === "questions")
  const [updating, setUpdating] = useState(false)
  
  const createdShown = useRef(false)
  const searchParams = useSearchParams();
  const router = useRouter();
  const created = searchParams.get("created");

  useEffect(() => {
    if (created && !createdShown.current) {
      createdShown.current = true;
      toast.success("Topic created");
      router.replace(`/admin-dashboard/topic/${topic.id}/edit`);
    }
  }, [created, topic.id, router]);

  useEffect(() => {
    setQuestionNavigationOpen(selectedTab === "questions" && questions.length > 0)
  }, [selectedTab, questions.length])

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

  const handleAddQuestion = () => {
    setQuestions((questions: Question[]) => 
      [ ...questions,
        {
          id: `tempQuestionId-${crypto.randomUUID()}`,
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
                id: `tempAnswerId-${crypto.randomUUID()}`,
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

  const handleDeleteTopic = async () => {
    const res = await deleteTopic(topic.id);

    if(res.success) {
      toast.success("Topic successfully deleted, You will be redirected in 3 seconds")

      setTopic({
        id: "",
        createdAt: "",
        name: "",
        description: "",
        dueDate: "",
        active: true,
        topicType: "QUIZ",
        questions: [],
        questionPoolSize: 1,
        section: sectionId || "",
      })
      setQuestions([])

      setTimeout(() => {
        window.location.href = "/admin-dashboard"
      }, 3000)
    }
    else {
      toast.error(`${res.error}`)
    }
  }

  const handleDeleteQuestion = (e: React.MouseEvent<HTMLButtonElement>) => {
    const questionId = String(e.currentTarget.id)
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

  const renderQuestions = () => 
      questions.map((question: Question, questionIndex: number) => (
        <Card key={question.id || questionIndex} id={`${question.id}`}>
          <div className="mb-4">
            <AlertButton
              name="question"
              onClick={handleDeleteQuestion}
              id = {question.id}
            />
          </div>
          <div className="space-y-2 md:space-y-6">
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
            <p className="mt-2 md:mt-4">Answers:</p>
            <Accordion.Root 
              type="multiple" 
              className="mt-2 md:mt-4"
            >
              <Accordion.Item
                value={`answers-${questionIndex}`}
                className="overflow-hidden rounded-lg border border-gray-100 shadow bg-white"
              >
                <AccordionTrigger className="group flex w-full cursor-pointer items-center justify-between px-2 md:px-4 py-3 text-left transition-colors hover:bg-gray-200 bg-gray-200/30">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800">
                      Answers
                    </span>
                    <span className="text-sm text-gray-500">
                      {question.answers.length} answer
                      {question.answers.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <ChevronUp className="h-5 w-5 text-gray-500 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </AccordionTrigger>

                <AccordionContent className="border-t border-blue-100 px-2 md:px-4 py-4 space-y-3 md:space-y-6">
                  {renderAnswers(questionIndex)}
                  <button
                    type="button"
                    className="mx-auto flex w-full  max-w-xl cursor-pointer items-center justify-center gap-2 rounded-lg bg-green-600/70 px-2 md:px-4 py-2.5 font-medium text-white shadow-sm transition-all duration-200 hover:bg-green-600 hover:shadow-md active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none disabled:hover:bg-gray-300 disabled:active:scale-100 disabled:focus:ring-0"
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
      ))
  

  const renderAnswers = (questionIndex: number) => {
    const question = questions[questionIndex] as Question
    return (
      question.answers.map(
        (answer: Answer, answerIndex: number) => (
          <Card key = {answer.id} theme="gray">
            <div
              className="mb-4 last:mb-0 space-y-3 md:space-y-6"
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
              <div className="flex flex-row justify-between items-center gap-2">
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

                <div className="">
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
      ) 
    )
  }

  const scrollQuestionToView = (questionId: string) => {
    document
      .getElementById(`${questionId}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return(
    <div className=
      {`py-4 md:py-12 lg:py-20 flex mx-auto px-2 md:px-4
        ${questionNavigationOpen ? "max-w-7xl" : "max-w-5xl"}
      `}
    >
      <Sidebar open={questionNavigationOpen}>
        <h2 className="mb-3 font-semibold text-gray-800">Questions</h2>
        <nav className="space-y-2 text-sm text-gray-600">
          {/* your sidebar content */}
          <div className="flex flex-col space-y-3 md:space-y-6">
            { questions.map((question: Question, questionIndex: number) => 
              <button
                key={`side-question-${question.id}`}
                className="text-left cursor-pointer"
                onClick={() => scrollQuestionToView(question.id || "")}
              >
                <Card hoverable={true}>
                  <p className="text-xs">
                    <span className="font-semibold text-md">Question:{questionIndex + 1}</span> <br />
                    {question.question}
                  </p>
                </Card>
              </button>
            )}
          </div>
        </nav>
      </Sidebar>
      <SectionCard>
        <Link
          href={`/admin-dashboard`}
          className="mb-4 group inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-600 shadow-sm transition-all duration-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 active:scale-95"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
          Back to dashboard
        </Link>
        <Card>
          <Tabs.Root 
            className="TabsRoot" defaultValue="topic"
            value={selectedTab} onValueChange={(e) => {
              if(typeof(e) === "string" && (e == "topic" || e == "questions")){
                setSelectedTab(e)
              }
            }}
          >
            <Tabs.List className="TabsList" aria-label="Manage your account">
              <div className="sticky top-2 z-10 w-full flex justify-between bg-blue-50 mb-2 md:mb-4 max-w-sm mx-auto h-13 shadow-md rounded-md">
                <div 
                  className={
                    `w-1/2 flex justify-center transition-colors duration-200
                    ${selectedTab === "topic" ? "text-blue-500 border-b-3 border-blue-400" : ""}
                    `}
                  >
                  <Tabs.Trigger 
                    value="topic"
                    className="w-full h-full"
                  >
                    Topic
                  </Tabs.Trigger>
                </div>

                <div 
                  className={
                    `w-1/2 flex justify-center transition-colors duration-200
                    ${selectedTab === "questions" ? "text-blue-500 border-b-3 border-blue-400" : ""
                  }`}
                >
                  <Tabs.Trigger 
                    value="questions"
                    className="w-full h-full"
                  >
                    Questions
                  </Tabs.Trigger>
                </div>
              </div>
              <Tabs.Content value="topic">
                <div className="space-y-3 lg:space-y-6">
                  <div className="flex justify-between w-full">
                    { topic.id != "" && 
                      <AlertButton
                        name="Topic"
                        onClick={handleDeleteTopic}
                      />
                    }
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
                  {topic.topicType === "RANDOM_QUESTIONS" && <Input handleInputChange={handleTopicChange} value={topic.questionPoolSize?.toString() || ""} name="questionPoolSize" label="Question pool size" />}
                  <div className="flex flex-col text-gray-700">
                    <label
                      htmlFor="dueDate"
                      className="text-sm text-gray-700/75"
                    >
                      Due Date
                    </label>

                    <div className="bg-blue-50/60 border-blue-200 border rounded px-2 py-1 focus-within:outline focus-within:outline-2 focus-within:outline-blue-500">
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
              </Tabs.Content>
              <Tabs.Content className="space-y-3 md:space-y-6" value="questions">
              {renderQuestions()}
              <button
                type="button"
                className="mx-auto flex w-1/2 max-w-xl cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow-md active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={handleAddQuestion}
              >
                <PlusIcon className="h-5 w-5" />
                <span>Add Question</span>
              </button>
              </Tabs.Content>
            </Tabs.List>
          </Tabs.Root>
          
        </Card>

        <div className="flex mx-auto justify-center mt-4 sticky top-0 bottom-3 z-10">
          <AlertButton
            name="topic"
            theme="regular"
            onClick={ () => {
              const callUpdateTopic = async () => {
                const res = await updateTopic(topic, questions)

                if(res.success){
                  toast.success("Topic updated successfully")
                }
                else{
                  toast.error("Error updating topic")
                }
              }
              callUpdateTopic();
            }}
          >
            <button 
              className=" mx-auto flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-100 px-4 py-2.5 font-medium text-blue-500 shadow-sm transition-all duration-200 hover:bg-blue-200 hover:shadow-md active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:scale-102 hover:text-blue-600"
            >
              <CheckIcon />
              { topic.id == "" 
                ? "Create Topic" 
                : "Update Topic"
              }
            </button>
          </AlertButton>
        </div>
      </SectionCard>
    </div>
  )
}