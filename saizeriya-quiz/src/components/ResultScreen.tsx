type Props = {
  correctCount: number
  total: number
  onRestart: () => void
}

export function ResultScreen({ correctCount, total, onRestart }: Props) {
  const pct = total === 0 ? 0 : Math.round((correctCount / total) * 100)

  return (
    <div className="screen">
      <h1 className="pageTitle">Result</h1>
      <div className="resultBox">
        <div className="resultScore">
          {correctCount} / {total}
        </div>
        <div className="resultPct">{pct}%</div>
      </div>

      <div className="ctaRow">
        <button type="button" className="primaryBtn" onClick={onRestart}>
          Play Again
        </button>
      </div>
    </div>
  )
}
