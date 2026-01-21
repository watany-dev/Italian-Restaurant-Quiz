import Papa from 'papaparse'
import type { MenuItem } from '../types'

type CsvRow = {
  Number?: string
  商品名?: string
  '料金（円）'?: string
}

function parseStrictInt(value: string, fieldName: string): number {
  const trimmed = value.trim()
  if (!/^[0-9]+$/.test(trimmed)) {
    throw new Error(`Invalid ${fieldName}: ${value}`)
  }
  const n = Number.parseInt(trimmed, 10)
  if (!Number.isFinite(n)) {
    throw new Error(`Invalid ${fieldName}: ${value}`)
  }
  return n
}

export async function loadMenuItems(csvUrl: string): Promise<MenuItem[]> {
  const res = await fetch(csvUrl)
  if (!res.ok) {
    throw new Error(`Failed to fetch CSV: ${res.status} ${res.statusText}`)
  }

  const csvText = await res.text()
  const parsed = Papa.parse<CsvRow>(csvText, {
    header: true,
    skipEmptyLines: 'greedy',
  })

  if (parsed.errors.length > 0) {
    const msg = parsed.errors[0]?.message ?? 'CSV parse error'
    throw new Error(msg)
  }

  const items: MenuItem[] = []
  const seen = new Set<number>()

  for (const row of parsed.data) {
    const numberRaw = row.Number ?? ''
    const nameRaw = row.商品名 ?? ''
    const priceRaw = row['料金（円）'] ?? ''

    const number = parseStrictInt(numberRaw, 'Number')
    const priceYen = parseStrictInt(priceRaw, '料金（円）')
    const name = nameRaw.trim()

    if (name.length === 0) {
      continue
    }

    // V1: if duplicate Number exists, keep the first.
    if (seen.has(number)) {
      // eslint-disable-next-line no-console
      console.warn(`Duplicate Number found in CSV. Skipping: ${number}`)
      continue
    }

    seen.add(number)
    items.push({ number, name, priceYen })
  }

  items.sort((a, b) => a.number - b.number)
  return items
}
