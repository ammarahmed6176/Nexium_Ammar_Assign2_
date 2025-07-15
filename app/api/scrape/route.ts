import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import * as cheerio from 'cheerio'

import { summarise } from '@/lib/summarize'
import { translateToUrdu } from '@/lib/translate'
import { saveToMongoDB } from '@/lib/mongodb'
import { saveToSupabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()

    if (!url || !url.startsWith('http')) {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
    }

    const { data: html } = await axios.get(url, { timeout: 10000 })
    const $ = cheerio.load(html)

    const containers = ['article', 'main', '.post-content', '.entry-content', '#content']
    let articleText = ''

    // Prefer semantic containers
    for (const selector of containers) {
      if ($(selector).length) {
        $(selector).find('p, li, h2, h3').each((_, el) => {
          const text = $(el).text().trim()
          if (
            text.length > 50 &&
            !/subscribe|comments|facebook|footer|instagram|login|author|copyright|ads?|share|email/i.test(text)
          ) {
            articleText += text + '\n'
          }
        })
        break
      }
    }

    // Fallback: All meaningful tags
    if (!articleText || articleText.length < 100) {
      $('p, li, h2, h3').each((_, el) => {
        const text = $(el).text().trim()
        if (
          text.length > 50 &&
          !/subscribe|comments|facebook|footer|instagram|login|author|ads?|share|email/i.test(text)
        ) {
          articleText += text + '\n'
        }
      })
    }

    articleText = articleText.trim().replace(/\s+/g, ' ')
    if (articleText.length < 100) {
      return NextResponse.json({ error: '⚠️ Could not extract meaningful content.' }, { status: 400 })
    }

    const summary = summarise(articleText)        // Plain summary (no bullet points)
    const urdu = await translateToUrdu(summary)   // Urdu translation (no bullet points)

    await saveToMongoDB({ url, fullText: articleText })
    await saveToSupabase({ url, summary, urdu })

    return NextResponse.json({ summary, urdu })
  } catch (error) {
    console.error('❌ Scraper Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
