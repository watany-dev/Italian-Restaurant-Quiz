import type { AnswerRecord } from '../types'
import { useMemo, useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'

type Props = {
  answers: AnswerRecord[]
  bestScore: number | null
  onRetry: () => void
  onBackToSetup: () => void
}

export function ResultScreen({ answers, bestScore, onRetry, onBackToSetup }: Props) {
  const { t } = useLanguage()
  const total = answers.length
  const correctCount = answers.reduce((acc, a) => acc + (a.selectedIndex === a.correctIndex ? 1 : 0), 0)
  const pct = total === 0 ? 0 : Math.round((correctCount / total) * 100)

  const [reviewMode, setReviewMode] = useState<'wrong' | 'all'>('wrong')

  const wrong = useMemo(() => answers.filter((a) => a.selectedIndex !== a.correctIndex), [answers])
  const reviewItems = useMemo(() => {
    return reviewMode === 'all' ? answers : wrong
  }, [answers, reviewMode, wrong])

  return (
    <div className="screen">
      <h1 className="pageTitle">{t('result')}</h1>
      <div className="resultBox">
        <div className="resultScore">
          {correctCount} / {total}
        </div>
        <div className="resultPct">{pct}%</div>
        <div className="resultMeta">
          {t('best')} {bestScore === null ? '-' : `${bestScore} / ${total}`}
        </div>
      </div>

      {reviewItems.length > 0 && (
        <section className="reviewSection">
          <div className="reviewHeader">
            <div className="panelTitle">{t('review')}</div>
            <div className="segmented" role="radiogroup" aria-label="Review mode">
              <button
                type="button"
                className={reviewMode === 'wrong' ? 'segBtn isActive' : 'segBtn'}
                role="radio"
                aria-checked={reviewMode === 'wrong'}
                onClick={() => setReviewMode('wrong')}
              >
                {t('wrongOnly')}
              </button>
              <button
                type="button"
                className={reviewMode === 'all' ? 'segBtn isActive' : 'segBtn'}
                role="radio"
                aria-checked={reviewMode === 'all'}
                onClick={() => setReviewMode('all')}
              >
                {t('all')}
              </button>
            </div>
          </div>
          <div className="reviewList">
            {reviewItems.map((a) => (
              <div className="reviewRow" key={a.questionId}>
                <div className="reviewTop">
                  <div className={a.selectedIndex === a.correctIndex ? 'badge badgeOk' : 'badge badgeNg'}>
                    {a.selectedIndex === a.correctIndex ? t('ok') : t('ng')}
                  </div>
                  <div className="reviewPrompt">{a.prompt}</div>
                </div>
                <div className="reviewHint">{a.instruction}</div>
                <div className="reviewDetail">
                  {t('yourAnswer')} {a.choices[a.selectedIndex]}
                </div>
                <div className="reviewDetail">{t('answer')} {a.choices[a.correctIndex]}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {reviewItems.length === 0 && (
        <div className="feedback ok" role="status">
          <div className="feedbackTitle">{t('perfect')}</div>
          <div className="feedbackBody">{t('noWrongAnswers')}</div>
        </div>
      )}

      <div className="ctaRow ctaRowSplit">
        <button type="button" className="secondaryBtn" onClick={onBackToSetup}>
          {t('back')}
        </button>
        <button type="button" className="primaryBtn" onClick={onRetry}>
          {t('retry')}
        </button>
      </div>
    </div>
  )
}
