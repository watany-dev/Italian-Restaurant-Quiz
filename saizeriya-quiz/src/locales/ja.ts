export const ja = {
  // App
  brandTitle: 'イタリアンレストランクイズ',
  loadingMenu: 'メニューデータを読み込み中...',
  failedToLoadCsv: 'CSVの読み込みに失敗しました',

  // SetupScreen
  bestThisMode: 'ベスト（このモード）:',
  questions: '問題数',
  mode: 'モード',
  modeNameToNumber: '商品名 → 番号',
  modeNumberToName: '番号 → 商品名',
  modeNameToPrice: '商品名 → 料金',
  difficulty: '難易度',
  easy: 'かんたん',
  normal: 'ふつう',
  hard: 'むずかしい',
  difficultyHint: 'かんたんはランダム、むずかしいは近い選択肢が出ます。',
  start: 'スタート',

  // QuizScreen
  questionProgress: '問題 {current} / {total}',
  correct: '正解！',
  wrong: '不正解',
  answer: '答え:',
  finish: '終了',
  next: '次へ',

  // ResultScreen
  result: '結果',
  best: 'ベスト:',
  review: '復習',
  wrongOnly: '間違いのみ',
  all: 'すべて',
  ok: '○',
  ng: '×',
  yourAnswer: 'あなたの回答:',
  perfect: '完璧！',
  noWrongAnswers: '間違いはありませんでした。',
  back: '戻る',
  retry: 'もう一度',

  // Question instructions
  instructionChooseNumber: '正しい番号を選んでください。',
  instructionChooseName: '正しい商品名を選んでください。',
  instructionChoosePrice: '正しい料金を選んでください。',

  // Format strings
  formatNumber: 'No. {number}',
  formatPrice: '{price}円',

  // Language selector
  language: '言語',

  // Menu reference
  officialMenu: '公式メニュー',
} as const
