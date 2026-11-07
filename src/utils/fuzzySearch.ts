const normalize = (value: string) => value.toLocaleLowerCase().trim()

const editDistance = (left: string, right: string): number => {
  let previousRow = Array.from({ length: right.length + 1 }, (_, index) => index)

  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    const currentRow = [leftIndex]
    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      const substitutionCost = left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1
      currentRow[rightIndex] = Math.min(
        currentRow[rightIndex - 1] + 1,
        previousRow[rightIndex] + 1,
        previousRow[rightIndex - 1] + substitutionCost,
      )
    }
    previousRow = currentRow
  }

  return previousRow[right.length]
}

const scoreToken = (queryToken: string, field: string): number | undefined => {
  const words = normalize(field)
    .split(/[^a-z0-9]+/)
    .filter(Boolean)

  let bestScore: number | undefined
  for (const word of words) {
    let score: number | undefined
    if (word === queryToken) {
      score = 1
    } else if (queryToken.length >= 2 && word.includes(queryToken)) {
      score = 0.9
    } else if (queryToken.length >= 4) {
      const distance = editDistance(queryToken, word)
      const maxDistance = Math.max(1, Math.floor(queryToken.length * 0.25))
      if (distance <= maxDistance) {
        score = 1 - distance / Math.max(queryToken.length, word.length)
      }
    }

    if (score !== undefined && (bestScore === undefined || score > bestScore)) {
      bestScore = score
    }
  }

  return bestScore
}

export const getFuzzyMatchScore = (query: string, fields: string[]): number | undefined => {
  const queryTokens = normalize(query).split(/\s+/).filter(Boolean)
  if (queryTokens.length === 0) return undefined

  const tokenScores = queryTokens.map((queryToken) => {
    const scores = fields
      .map((field) => scoreToken(queryToken, field))
      .filter((score): score is number => score !== undefined)
    return scores.length > 0 ? Math.max(...scores) : undefined
  })

  if (tokenScores.some((score) => score === undefined)) return undefined
  return tokenScores.reduce<number>((total, score) => total + (score ?? 0), 0) / queryTokens.length
}
