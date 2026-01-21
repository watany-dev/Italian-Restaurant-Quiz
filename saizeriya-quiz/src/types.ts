export type MenuItem = {
  number: number
  name: string
  priceYen: number
}

export type Mode = 'nameToNumber' | 'numberToName' | 'nameToPrice'

export type Difficulty = 'easy' | 'normal' | 'hard'

export type QuestionCount = 5 | 10

export type Question = {
  id: string
  prompt: string
  instruction: string
  choices: string[]
  correctIndex: number
}

export type AnswerRecord = {
  questionId: string
  prompt: string
  instruction: string
  choices: string[]
  correctIndex: number
  selectedIndex: number
}

export type LoadState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'loaded'; data: T }
  | { status: 'error'; message: string }
