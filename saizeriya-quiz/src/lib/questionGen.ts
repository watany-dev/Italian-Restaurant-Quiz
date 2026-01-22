import type { Difficulty, MenuItem, Question } from '../types'

function shuffleInPlace<T>(arr: T[], rng: () => number): void {
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
}

function uniqueByString(items: string[]): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const x of items) {
    if (seen.has(x)) continue
    seen.add(x)
    out.push(x)
  }
  return out
}

function sampleUniqueIndices(maxExclusive: number, count: number, excluded: Set<number>): number[] {
  if (count <= 0) return []
  if (maxExclusive <= 0) return []

  const pool: number[] = []
  for (let i = 0; i < maxExclusive; i += 1) {
    if (!excluded.has(i)) pool.push(i)
  }

  if (pool.length < count) {
    throw new Error(`Not enough unique candidates: need=${count} have=${pool.length}`)
  }

  shuffleInPlace(pool, Math.random)
  return pool.slice(0, count)
}

function neighborIndices(centerIndex: number, maxExclusive: number, count: number): number[] {
  const out: number[] = []
  for (let dist = 1; out.length < count; dist += 1) {
    const left = centerIndex - dist
    const right = centerIndex + dist
    if (left >= 0) out.push(left)
    if (out.length >= count) break
    if (right < maxExclusive) out.push(right)
    if (dist > maxExclusive) break
  }
  return out.slice(0, count)
}

function pickDecoyIndices(params: {
  difficulty: Difficulty
  maxExclusive: number
  count: number
  centerIndex: number
  excluded: Set<number>
}): number[] {
  const { difficulty, maxExclusive, count, centerIndex, excluded } = params

  const nearCount = difficulty === 'easy' ? 0 : difficulty === 'normal' ? Math.min(2, count) : count
  const nearCandidates = neighborIndices(centerIndex, maxExclusive, count * 3).filter((i) => !excluded.has(i))
  const pickedNear = nearCandidates.slice(0, nearCount)

  const excluded2 = new Set(excluded)
  for (const i of pickedNear) excluded2.add(i)

  const remaining = count - pickedNear.length
  const pickedRandom = remaining > 0 ? sampleUniqueIndices(maxExclusive, remaining, excluded2) : []
  return [...pickedNear, ...pickedRandom]
}

function uniqueNumbersSorted(nums: number[]): number[] {
  const set = new Set(nums)
  return [...set].sort((a, b) => a - b)
}

export function generateNameToNumberQuestion(
  item: MenuItem,
  allItems: MenuItem[],
  difficulty: Difficulty,
  choiceCount = 4,
): Question {
  if (choiceCount < 2) {
    throw new Error('choiceCount must be >= 2')
  }
  if (allItems.length < choiceCount) {
    throw new Error('Not enough items to generate choices')
  }

  const correct = `No. ${item.number}`
  const excluded = new Set<number>()
  const correctIndexInAll = allItems.findIndex((x) => x.number === item.number)
  if (correctIndexInAll >= 0) excluded.add(correctIndexInAll)

  const decoyIndices = pickDecoyIndices({
    difficulty,
    maxExclusive: allItems.length,
    count: choiceCount - 1,
    centerIndex: Math.max(0, correctIndexInAll),
    excluded,
  })
  const decoys = decoyIndices.map((idx) => `No. ${allItems[idx]!.number}`)

  const choices = [correct, ...decoys]
  shuffleInPlace(choices, Math.random)

  const correctIndex = choices.indexOf(correct)
  return {
    id: `nameToNumber:${item.number}`,
    prompt: item.name,
    instruction: 'Choose the correct Number.',
    choices,
    correctIndex,
  }
}

export function generateNumberToNameQuestion(
  item: MenuItem,
  allItems: MenuItem[],
  difficulty: Difficulty,
  choiceCount = 4,
): Question {
  if (choiceCount < 2) {
    throw new Error('choiceCount must be >= 2')
  }
  if (allItems.length < choiceCount) {
    throw new Error('Not enough items to generate choices')
  }

  const correct = item.name
  const excluded = new Set<number>()
  const correctIndexInAll = allItems.findIndex((x) => x.number === item.number)
  if (correctIndexInAll >= 0) excluded.add(correctIndexInAll)

  const decoyIndices = pickDecoyIndices({
    difficulty,
    maxExclusive: allItems.length,
    count: choiceCount - 1,
    centerIndex: Math.max(0, correctIndexInAll),
    excluded,
  })
  const decoys = decoyIndices.map((idx) => allItems[idx]!.name)

  const choices = uniqueByString([correct, ...decoys])
  // If CSV has duplicate names, top up with more random items.
  if (choices.length < choiceCount) {
    const nameSet = new Set(choices)
    for (const x of allItems) {
      if (choices.length >= choiceCount) break
      if (x.number === item.number) continue
      if (nameSet.has(x.name)) continue
      nameSet.add(x.name)
      choices.push(x.name)
    }
  }
  if (choices.length !== choiceCount) {
    throw new Error('Failed to generate unique name choices')
  }

  shuffleInPlace(choices, Math.random)
  const correctIndex = choices.indexOf(correct)
  return {
    id: `numberToName:${item.number}`,
    prompt: `No. ${item.number}`,
    instruction: 'Choose the correct menu name.',
    choices,
    correctIndex,
  }
}

export function generateNameToPriceQuestion(
  item: MenuItem,
  allItems: MenuItem[],
  difficulty: Difficulty,
  choiceCount = 4,
): Question {
  if (choiceCount < 2) {
    throw new Error('choiceCount must be >= 2')
  }

  const uniquePrices = uniqueNumbersSorted(allItems.map((x) => x.priceYen))
  if (uniquePrices.length < choiceCount) {
    throw new Error('Not enough unique prices to generate choices')
  }

  const correctPrice = item.priceYen
  const excluded = new Set<number>()
  const correctIndexInPrices = uniquePrices.findIndex((x) => x === correctPrice)
  if (correctIndexInPrices >= 0) excluded.add(correctIndexInPrices)

  const decoyIndices = pickDecoyIndices({
    difficulty,
    maxExclusive: uniquePrices.length,
    count: choiceCount - 1,
    centerIndex: Math.max(0, correctIndexInPrices),
    excluded,
  })
  const decoys = decoyIndices.map((idx) => uniquePrices[idx]!)

  const priceChoices = [correctPrice, ...decoys].map((p) => `${p}円`)
  shuffleInPlace(priceChoices, Math.random)

  const correctLabel = `${correctPrice}円`
  const correctIndex = priceChoices.indexOf(correctLabel)
  return {
    id: `nameToPrice:${item.number}`,
    prompt: item.name,
    instruction: 'Choose the correct price (yen).',
    choices: priceChoices,
    correctIndex,
  }
}

export function pickQuizItems(items: MenuItem[], count: number): MenuItem[] {
  if (count <= 0) return []
  if (items.length < count) {
    throw new Error(`Not enough items: need=${count} have=${items.length}`)
  }

  const copy = [...items]
  shuffleInPlace(copy, Math.random)
  return copy.slice(0, count)
}
