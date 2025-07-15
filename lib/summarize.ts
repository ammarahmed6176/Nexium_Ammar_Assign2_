/**
 * AI-like blog summarizer for any content.
 * Uses scoring + keyword relevance + number fixing.
 */

export function summarise(text: string): string {
  const cleanText = text
    .replace(/<[^>]+>/g, '') // Remove HTML tags
    .replace(/(\d+)\s*\n\s*(\d+)/g, '$1.$2') // Fix broken decimal numbers (e.g., 18\n8 → 18.8)
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()

  const sentences = cleanText
    .split(/(?<=[.؟!])\s+/)
    .map((s) => s.trim())
    .filter(s =>
      s.length > 40 &&
      s.length < 400 &&
      !/facebook|instagram|comment|email|login|advertisement|subscribe|©|all rights reserved|posted by|follow/i.test(s)
    )

  if (sentences.length < 3) return cleanText.slice(0, 300)

  const keywords: { [key: string]: number } = {
    increase: 2,
    decrease: 2,
    percent: 1.5,
    rise: 2,
    fall: 2,
    drop: 2,
    ban: 2,
    death: 2.5,
    cancer: 2.5,
    announce: 2,
    launch: 1.8,
    report: 1.5,
    study: 1.5,
    protest: 2,
    tax: 2,
    fee: 2,
    vehicle: 1.5,
    suzuki: 1.5,
    toyota: 1.5,
    pakistan: 1,
    india: 1,
    government: 2,
    budget: 2,
    dollar: 1.5,
    rupee: 1.5,
    crore: 1.5,
    million: 1.5,
    bmw: 1.5,
    price: 1.5,
    discount: 1.5,
    policy: 2,
    education: 2,
    health: 2,
    arrest: 2.5,
    spy: 2.5,
  }

  const scored = sentences.map((sentence, index) => {
    let score = 0
    if (index < 5) score += 0.5
    for (const [word, weight] of Object.entries(keywords)) {
      if (sentence.toLowerCase().includes(word)) {
        score += weight
      }
    }
    if (sentence.length >= 60 && sentence.length <= 250) score += 0.5
    return { sentence, score }
  })

  const top = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((s) => s.sentence)

  return top.join(' ')
}
