import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function saveToSupabase(data: { url: string; summary: string; urdu: string }) {
  const { error } = await supabase.from('summaries').insert([{
    url: data.url,
    summary: data.summary,
    urdu: data.urdu,
    created_at: new Date().toISOString()
  }])

  if (error) {
    console.error('❌ Supabase insert failed:', error.message)
  } else {
    console.log('✅ Supabase insert successful')
  }
}
