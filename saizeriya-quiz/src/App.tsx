import './App.css'
import { useEffect, useState } from 'react'
import { loadMenuItems } from './lib/loadMenu'
import type { AnswerRecord, Difficulty, LoadState, MenuItem, Mode, Question, QuestionCount } from './types'
import { SetupScreen } from './components/SetupScreen'
import { QuizScreen } from './components/QuizScreen'
import { ResultScreen } from './components/ResultScreen'
import {
  generateNameToNumberQuestion,
  generateNameToPriceQuestion,
  generateNumberToNameQuestion,
  pickQuizItems,
} from './lib/questionGen'
import { useLanguage } from './contexts/LanguageContext'

type Screen = 'setup' | 'quiz' | 'result'

function bestScoreKey(mode: Mode, difficulty: Difficulty, questionCount: QuestionCount): string {
  return `saizeriyaQuiz.bestScore.v1:${mode}:${difficulty}:${questionCount}`
}

function loadBestScore(mode: Mode, difficulty: Difficulty, questionCount: QuestionCount): number | null {
  const raw = localStorage.getItem(bestScoreKey(mode, difficulty, questionCount))
  if (raw === null) return null
  const n = Number.parseInt(raw, 10)
  return Number.isFinite(n) ? n : null
}

function saveBestScore(
  mode: Mode,
  difficulty: Difficulty,
  questionCount: QuestionCount,
  score: number,
): void {
  localStorage.setItem(bestScoreKey(mode, difficulty, questionCount), String(score))
}

function App() {
  const { language, setLanguage, t } = useLanguage()
  const [menuState, setMenuState] = useState<LoadState<MenuItem[]>>({ status: 'idle' })
  const [screen, setScreen] = useState<Screen>('setup')
  const [mode, setMode] = useState<Mode>('nameToNumber')
  const [difficulty, setDifficulty] = useState<Difficulty>('normal')
  const [questionCount, setQuestionCount] = useState<QuestionCount>(10)

  const [questions, setQuestions] = useState<Question[]>([])
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [answers, setAnswers] = useState<AnswerRecord[]>([])
  const [bestScore, setBestScore] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false
    setMenuState({ status: 'loading' })

    loadMenuItems(`${import.meta.env.BASE_URL}sauzerua.csv`)
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

  useEffect(() => {
    if (menuState.status !== 'loaded') return
    setBestScore(loadBestScore(mode, difficulty, questionCount))
  }, [menuState.status, mode, difficulty, questionCount])

  const startQuiz = () => {
    if (menuState.status !== 'loaded') return

    const total = questionCount
    const picked = pickQuizItems(menuState.data, total)
    const qs = picked.map((item) => {
      switch (mode) {
        case 'nameToNumber':
          return generateNameToNumberQuestion(item, menuState.data, difficulty, 4, language)
        case 'numberToName':
          return generateNumberToNameQuestion(item, menuState.data, difficulty, 4, language)
        case 'nameToPrice':
          return generateNameToPriceQuestion(item, menuState.data, difficulty, 4, language)
        default:
          return generateNameToNumberQuestion(item, menuState.data, difficulty, 4, language)
      }
    })

    setQuestions(qs)
    setQuestionIndex(0)
    setSelectedIndex(null)
    setAnswers([])
    setScreen('quiz')
  }

  const onSelectAnswer = (idx: number) => {
    if (screen !== 'quiz') return
    if (selectedIndex !== null) return
    const q = questions[questionIndex]
    if (!q) return

    setSelectedIndex(idx)
    setAnswers((prev) => {
      const record: AnswerRecord = {
        questionId: q.id,
        prompt: q.prompt,
        instruction: q.instruction,
        choices: q.choices,
        correctIndex: q.correctIndex,
        selectedIndex: idx,
      }
      return [...prev, record]
    })
  }

  const onNext = () => {
    if (screen !== 'quiz') return
    if (selectedIndex === null) return

    const nextIndex = questionIndex + 1
    if (nextIndex >= questions.length) {
      const correctSoFar = answers.reduce(
        (acc, a) => acc + (a.selectedIndex === a.correctIndex ? 1 : 0),
        0,
      )

      // answers is appended on selection; if state hasn't caught up yet,
      // include the last answer exactly once.
      const needLast = answers.length < questions.length
      const lastWasCorrect = selectedIndex === questions[questionIndex]?.correctIndex
      const score = correctSoFar + (needLast && lastWasCorrect ? 1 : 0)

      const currentBest = loadBestScore(mode, difficulty, questionCount)
      if (currentBest === null || score > currentBest) {
        saveBestScore(mode, difficulty, questionCount, score)
        setBestScore(score)
      } else {
        setBestScore(currentBest)
      }

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
    setAnswers([])
  }

  const retry = () => {
    startQuiz()
  }

  return (
    <div className="app">
      <header className="appHeader">
        <button type="button" className="brand" onClick={restart}>
          <div className="brandMark" aria-hidden="true">
            IQ
          </div>
          <div className="brandText">
            <div className="brandTitle">{t('brandTitle')}</div>
          </div>
        </button>
        <div className="langSwitch">
          <button
            type="button"
            className={language === 'en' ? 'langBtn isActive' : 'langBtn'}
            onClick={() => setLanguage('en')}
          >
            EN
          </button>
          <button
            type="button"
            className={language === 'ja' ? 'langBtn isActive' : 'langBtn'}
            onClick={() => setLanguage('ja')}
          >
            JA
          </button>
        </div>
      </header>

      <main className="card">
        {menuState.status === 'loading' && <p className="muted">{t('loadingMenu')}</p>}

        {menuState.status === 'error' && (
          <div className="errorBox" role="alert">
            <div className="errorTitle">{t('failedToLoadCsv')}</div>
            <div className="errorMessage">{menuState.message}</div>
          </div>
        )}

        {menuState.status === 'loaded' && screen === 'setup' && (
          <>
            <SetupScreen
              mode={mode}
              difficulty={difficulty}
              questionCount={questionCount}
              bestScore={bestScore}
              onChangeMode={setMode}
              onChangeDifficulty={setDifficulty}
              onChangeQuestionCount={setQuestionCount}
              onStart={startQuiz}
            />
          </>
        )}

        {menuState.status === 'loaded' && screen === 'quiz' && questions[questionIndex] && (
          <QuizScreen
            key={questions[questionIndex]!.id}
            question={questions[questionIndex]!}
            index={questionIndex}
            total={questions.length}
            selectedIndex={selectedIndex}
            onSelect={onSelectAnswer}
            onNext={onNext}
          />
        )}

        {menuState.status === 'loaded' && screen === 'result' && (
          <ResultScreen
            answers={answers}
            bestScore={bestScore}
            onRetry={retry}
            onBackToSetup={restart}
          />
        )}
      </main>
    </div>
  )
}

export default App
