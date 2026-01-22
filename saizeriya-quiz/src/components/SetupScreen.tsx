import type { Difficulty, Mode, QuestionCount } from '../types'

type Props = {
  mode: Mode
  difficulty: Difficulty
  questionCount: QuestionCount
  bestScore: number | null
  onChangeMode: (mode: Mode) => void
  onChangeDifficulty: (difficulty: Difficulty) => void
  onChangeQuestionCount: (count: QuestionCount) => void
  onStart: () => void
}

export function SetupScreen({
  mode,
  difficulty,
  questionCount,
  bestScore,
  onChangeMode,
  onChangeDifficulty,
  onChangeQuestionCount,
  onStart,
}: Props) {
  return (
    <div className="screen">
      <p className="mutedSmall">
        Best (this mode): {bestScore === null ? '-' : `${bestScore} / ${questionCount}`}
      </p>

      <section className="panel">
        <div className="panelTitle">Questions</div>
        <div className="segmented" role="radiogroup" aria-label="Question count">
          <button
            type="button"
            className={questionCount === 5 ? 'segBtn isActive' : 'segBtn'}
            role="radio"
            aria-checked={questionCount === 5}
            onClick={() => onChangeQuestionCount(5)}
          >
            5
          </button>
          <button
            type="button"
            className={questionCount === 10 ? 'segBtn isActive' : 'segBtn'}
            role="radio"
            aria-checked={questionCount === 10}
            onClick={() => onChangeQuestionCount(10)}
          >
            10
          </button>
        </div>
      </section>

      <section className="panel">
        <div className="panelTitle">Mode</div>
        <div className="segmented" role="radiogroup" aria-label="Mode">
          <button
            type="button"
            className={mode === 'nameToNumber' ? 'segBtn isActive' : 'segBtn'}
            role="radio"
            aria-checked={mode === 'nameToNumber'}
            onClick={() => onChangeMode('nameToNumber')}
          >
            商品名 → Number
          </button>
          <button
            type="button"
            className={mode === 'numberToName' ? 'segBtn isActive' : 'segBtn'}
            role="radio"
            aria-checked={mode === 'numberToName'}
            onClick={() => onChangeMode('numberToName')}
          >
            Number → 商品名
          </button>
          <button
            type="button"
            className={mode === 'nameToPrice' ? 'segBtn isActive' : 'segBtn'}
            role="radio"
            aria-checked={mode === 'nameToPrice'}
            onClick={() => onChangeMode('nameToPrice')}
          >
            商品名 → 料金
          </button>
        </div>
      </section>

      <section className="panel">
        <div className="panelTitle">Difficulty</div>
        <div className="segmented" role="radiogroup" aria-label="Difficulty">
          <button
            type="button"
            className={difficulty === 'easy' ? 'segBtn isActive' : 'segBtn'}
            role="radio"
            aria-checked={difficulty === 'easy'}
            onClick={() => onChangeDifficulty('easy')}
          >
            Easy
          </button>
          <button
            type="button"
            className={difficulty === 'normal' ? 'segBtn isActive' : 'segBtn'}
            role="radio"
            aria-checked={difficulty === 'normal'}
            onClick={() => onChangeDifficulty('normal')}
          >
            Normal
          </button>
          <button
            type="button"
            className={difficulty === 'hard' ? 'segBtn isActive' : 'segBtn'}
            role="radio"
            aria-checked={difficulty === 'hard'}
            onClick={() => onChangeDifficulty('hard')}
          >
            Hard
          </button>
        </div>
        <p className="mutedSmall">Easy is more random; Hard is more "close" options.</p>
      </section>

      <div className="ctaRow">
        <button type="button" className="primaryBtn" onClick={onStart}>
          Start ({questionCount})
        </button>
      </div>
    </div>
  )
}
