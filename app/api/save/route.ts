import { NextRequest, NextResponse } from 'next/server'
import { saveToMongoDB } from '@/lib/mongodb'
import { saveToSupabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { url, fullText, summary, urdu } = body

    if (!url) {
      return NextResponse.json({ error: 'Missing URL' }, { status: 400 })
    }

    if (fullText) {
      await saveToMongoDB({ url, fullText })
      console.log('✅ Saved to MongoDB')
    }

    if (summary && urdu) {
      await saveToSupabase({ url, summary, urdu })
      console.log('✅ Saved to Supabase')
    }

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('❌ Save Error:', error.message)
    } else {
      console.error('❌ Unknown Save Error:', error)
    }

    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 })
  }
}
