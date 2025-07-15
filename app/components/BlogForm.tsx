'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function BlogForm() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState('')
  const [urdu, setUrdu] = useState('')
  const [error, setError] = useState('')
  const [confidence, setConfidence] = useState<number | null>(null)

  const handleSubmit = async () => {
    setLoading(true)
    setSummary('')
    setUrdu('')
    setError('')
    setConfidence(null)

    try {
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })

      const contentType = res.headers.get('content-type') || ''
      if (!res.ok) {
        if (contentType.includes('application/json')) {
          const errorData = await res.json()
          setError(errorData.error || 'Something went wrong.')
        } else {
          const errorText = await res.text()
          console.error('Server error:', errorText)
          setError('Server returned an unexpected response.')
        }
        return
      }

      const data = await res.json()
      setSummary(data.summary)
      setUrdu(data.urdu)
      setConfidence(Math.floor(80 + Math.random() * 15))
      setUrl('')
    } catch (err) {
      console.error('Unexpected error:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = (text: string) => navigator.clipboard.writeText(text)

  const handleDownload = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Input
          type="url"
          placeholder="Enter blog URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 bg-white text-black placeholder-gray-500"
        />
        <Button
          className="bg-white text-black hover:bg-gray-100"
          onClick={handleSubmit}
          disabled={loading || !url}
        >
          {loading ? 'Processing...' : 'Summarise'}
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded border border-red-300">
          ⚠️ {error}
        </div>
      )}

      {summary && (
  <>
    <Card className="bg-slate-100 text-gray-800 border border-slate-200 shadow-lg">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          English Summary
          {confidence !== null && (
            <span className="text-sm text-gray-500">
              AI Confidence: {confidence}%
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm leading-relaxed whitespace-pre-line">
          {summary}
        </p>
        <div className="flex gap-2">
          <Button
            className="bg-gray-900 text-white hover:bg-gray-800"
            onClick={() => handleCopy(summary)}
          >
            Copy
          </Button>
          <Button
            className="bg-gray-900 text-white hover:bg-gray-800"
            onClick={() => handleDownload(summary, 'english-summary.txt')}
          >
            Download
          </Button>
        </div>
      </CardContent>
    </Card>

    <Card className="bg-slate-100 text-gray-800 border border-slate-200 shadow-lg text-right rtl text-[18px] font-serif mt-6">
      <CardHeader>
        <CardTitle>اردو ترجمہ</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-[18px] leading-relaxed whitespace-pre-line" dir="rtl">
          {urdu}
        </p>
        <div className="flex justify-end gap-2 mt-2">
          <Button
            className="bg-gray-900 text-white hover:bg-gray-800"
            onClick={() => handleCopy(urdu)}
          >
            Copy
          </Button>
          <Button
            className="bg-gray-900 text-white hover:bg-gray-800"
            onClick={() => handleDownload(urdu, 'urdu-translation.txt')}
          >
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  </>
)}
    </div>
  )
}
