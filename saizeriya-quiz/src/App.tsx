import './App.css'
import { useEffect, useState } from 'react'
import { loadMenuItems } from './lib/loadMenu'
import type { Difficulty, LoadState, MenuItem, Mode, Question } from './types'
import { SetupScreen } from './components/SetupScreen'
import { QuizScreen } from './components/QuizScreen'
import { ResultScreen } from './components/ResultScreen'
import {
  generateNameToNumberQuestion,
  generateNameToPriceQuestion,
  generateNumberToNameQuestion,
  pickQuizItems,
} from './lib/questionGen'

type Screen = 'setup' | 'quiz' | 'result'

function App() {
  const [menuState, setMenuState] = useState<LoadState<MenuItem[]>>({ status: 'idle' })
  const [screen, setScreen] = useState<Screen>('setup')
  const [mode, setMode] = useState<Mode>('nameToNumber')
  const [difficulty, setDifficulty] = useState<Difficulty>('normal')

  const [questions, setQuestions] = useState<Question[]>([])
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [correctCount, setCorrectCount] = useState(0)

  useEffect(() => {
    let cancelled = false
    setMenuState({ status: 'loading' })

    loadMenuItems('/sauzerua.csv')
      .then((items) => {
        if (cancelled) return
        setMenuState({ status: 'loaded', data: items })
      })
      .catch((err: unknown) => {
        if (cancelled) return
        const message = err instanceof Error ? err.message : String(err)
        setMenuState({ status: 'error', message })
      })

    return () => {
      cancelled = true
    }
  }, [])

  const startQuiz = () => {
    if (menuState.status !== 'loaded') return

    const total = 10
    const picked = pickQuizItems(menuState.data, total)
    const qs = picked.map((item) => {
      switch (mode) {
        case 'nameToNumber':
          return generateNameToNumberQuestion(item, menuState.data, difficulty, 4)
        case 'numberToName':
          return generateNumberToNameQuestion(item, menuState.data, difficulty, 4)
        case 'nameToPrice':
          return generateNameToPriceQuestion(item, menuState.data, difficulty, 4)
        default:
          return generateNameToNumberQuestion(item, menuState.data, difficulty, 4)
      }
    })

    setQuestions(qs)
    setQuestionIndex(0)
    setSelectedIndex(null)
    setCorrectCount(0)
    setScreen('quiz')
  }

  const onSelectAnswer = (idx: number) => {
    if (screen !== 'quiz') return
    if (selectedIndex !== null) return
    const q = questions[questionIndex]
    if (!q) return

    setSelectedIndex(idx)
    if (idx === q.correctIndex) {
      setCorrectCount((c) => c + 1)
    }
  }

  const onNext = () => {
    if (screen !== 'quiz') return
    if (selectedIndex === null) return

    const nextIndex = questionIndex + 1
    if (nextIndex >= questions.length) {
      setScreen('result')
      return
    }

    setQuestionIndex(nextIndex)
    setSelectedIndex(null)
  }

  const restart = () => {
    setScreen('setup')
    setQuestions([])
    setQuestionIndex(0)
    setSelectedIndex(null)
    setCorrectCount(0)
  }

  return (
    <div className="app">
      <header className="appHeader">
        <div className="brand">
          <div className="brandMark" aria-hidden="true">
            SQ
          </div>
          <div className="brandText">
            <div className="brandTitle">Saizeriya Quiz</div>
            <div className="brandSub">CSV-driven menu quiz (local)</div>
          </div>
        </div>
      </header>

      <main className="card">
        {menuState.status === 'loading' && <p className="muted">Loading /sauzerua.csv ...</p>}

        {menuState.status === 'error' && (
          <div className="errorBox" role="alert">
            <div className="errorTitle">Failed to load CSV</div>
            <div className="errorMessage">{menuState.message}</div>
          </div>
        )}

        {menuState.status === 'loaded' && screen === 'setup' && (
          <>
            <p className="muted">Loaded: {menuState.data.length} items</p>
            <SetupScreen
              mode={mode}
              difficulty={difficulty}
              onChangeMode={setMode}
              onChangeDifficulty={setDifficulty}
              onStart={startQuiz}
            />
          </>
        )}

        {menuState.status === 'loaded' && screen === 'quiz' && questions[questionIndex] && (
          <QuizScreen
            question={questions[questionIndex]!}
            index={questionIndex}
            total={questions.length}
            selectedIndex={selectedIndex}
            onSelect={onSelectAnswer}
            onNext={onNext}
          />
        )}

        {menuState.status === 'loaded' && screen === 'result' && (
          <ResultScreen correctCount={correctCount} total={questions.length} onRestart={restart} />
        )}
      </main>
    </div>
  )
}

export default App
