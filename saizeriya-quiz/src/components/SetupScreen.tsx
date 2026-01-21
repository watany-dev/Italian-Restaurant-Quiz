import type { Difficulty, Mode } from '../types'

type Props = {
  mode: Mode
  difficulty: Difficulty
  onChangeMode: (mode: Mode) => void
  onChangeDifficulty: (difficulty: Difficulty) => void
  onStart: () => void
}

export function SetupScreen({
  mode,
  difficulty,
  onChangeMode,
  onChangeDifficulty,
  onStart,
}: Props) {
  return (
    <div className="screen">
      <p className="muted">10 questions, 4 choices. Local CSV-driven.</p>

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
          Start (10)
        </button>
      </div>
    </div>
  )
}
