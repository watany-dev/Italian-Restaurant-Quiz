import type { Difficulty, Mode, QuestionCount } from '../types'
import { useLanguage } from '../contexts/LanguageContext'

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
  const { t } = useLanguage()

  return (
    <div className="screen">
      <p className="mutedSmall">
        {t('bestThisMode')} {bestScore === null ? '-' : `${bestScore} / ${questionCount}`}
      </p>

      <section className="panel">
        <div className="panelTitle">{t('questions')}</div>
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
        <div className="panelTitle">{t('mode')}</div>
        <div className="segmented" role="radiogroup" aria-label="Mode">
          <button
            type="button"
            className={mode === 'nameToNumber' ? 'segBtn isActive' : 'segBtn'}
            role="radio"
            aria-checked={mode === 'nameToNumber'}
            onClick={() => onChangeMode('nameToNumber')}
          >
            {t('modeNameToNumber')}
          </button>
          <button
            type="button"
            className={mode === 'numberToName' ? 'segBtn isActive' : 'segBtn'}
            role="radio"
            aria-checked={mode === 'numberToName'}
            onClick={() => onChangeMode('numberToName')}
          >
            {t('modeNumberToName')}
          </button>
          <button
            type="button"
            className={mode === 'nameToPrice' ? 'segBtn isActive' : 'segBtn'}
            role="radio"
            aria-checked={mode === 'nameToPrice'}
            onClick={() => onChangeMode('nameToPrice')}
          >
            {t('modeNameToPrice')}
          </button>
        </div>
      </section>

      <section className="panel">
        <div className="panelTitle">{t('difficulty')}</div>
        <div className="segmented" role="radiogroup" aria-label="Difficulty">
          <button
            type="button"
            className={difficulty === 'easy' ? 'segBtn isActive' : 'segBtn'}
            role="radio"
            aria-checked={difficulty === 'easy'}
            onClick={() => onChangeDifficulty('easy')}
          >
            {t('easy')}
          </button>
          <button
            type="button"
            className={difficulty === 'normal' ? 'segBtn isActive' : 'segBtn'}
            role="radio"
            aria-checked={difficulty === 'normal'}
            onClick={() => onChangeDifficulty('normal')}
          >
            {t('normal')}
          </button>
          <button
            type="button"
            className={difficulty === 'hard' ? 'segBtn isActive' : 'segBtn'}
            role="radio"
            aria-checked={difficulty === 'hard'}
            onClick={() => onChangeDifficulty('hard')}
          >
            {t('hard')}
          </button>
        </div>
        <p className="mutedSmall">{t('difficultyHint')}</p>
      </section>

      <div className="ctaRow">
        <button type="button" className="primaryBtn" onClick={onStart}>
          {t('start')} ({questionCount})
        </button>
      </div>
    </div>
  )
}
