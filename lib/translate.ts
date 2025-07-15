// lib/translate.ts

import axios from 'axios'

export async function translateToUrdu(text: string): Promise<string> {
  try {
    const res = await axios.get('https://translate.googleapis.com/translate_a/single', {
      params: {
        client: 'gtx',
        sl: 'en',
        tl: 'ur',
        dt: 't',
        q: text
      }
    })

    return res.data[0].map((chunk: [string]) => chunk[0]).join('')
  } catch (err) {
    console.error('❌ Urdu translation failed:', err)
    return '[Translation Error]'
  }
}
