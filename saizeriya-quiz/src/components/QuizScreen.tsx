import { useMemo } from 'react'
import type { Question } from '../types'

type Props = {
  question: Question
  index: number
  total: number
  selectedIndex: number | null
  onSelect: (idx: number) => void
  onNext: () => void
}

export function QuizScreen({
  question,
  index,
  total,
  selectedIndex,
  onSelect,
  onNext,
}: Props) {
  const isAnswered = selectedIndex !== null
  const isCorrect = selectedIndex === question.correctIndex

  const title = useMemo(() => {
    return `Question ${index + 1} / ${total}`
  }, [index, total])

  return (
    <div className="screen">
      <div className="topRow">
        <div className="pill">{title}</div>
      </div>

      <h1 className="questionPrompt">{question.prompt}</h1>
      <p className="mutedSmall">{question.instruction}</p>

      <div className="choiceGrid">
        {question.choices.map((choice, idx) => {
          const isChoiceCorrect = idx === question.correctIndex
          const isChoiceSelected = idx === selectedIndex

          let className = 'choiceBtn'
          if (isAnswered && isChoiceCorrect) className += ' isCorrect'
          if (isAnswered && isChoiceSelected && !isChoiceCorrect) className += ' isWrong'

          return (
            <button
              key={`${question.id}:${choice}`}
              type="button"
              className={className}
              disabled={isAnswered}
              onClick={() => onSelect(idx)}
            >
              {choice}
            </button>
          )
        })}
      </div>

      {isAnswered && (
        <div className={isCorrect ? 'feedback ok' : 'feedback ng'} role="status">
          <div className="feedbackTitle">{isCorrect ? 'Correct' : 'Wrong'}</div>
          <div className="feedbackBody">Answer: {question.choices[question.correctIndex]}</div>
        </div>
      )}

      <div className="ctaRow">
        <button type="button" className="primaryBtn" onClick={onNext} disabled={!isAnswered}>
          {index + 1 === total ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  )
}
