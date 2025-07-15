'use client'

import BlogForm from './components/BlogForm'

export default function Home() {
  return (
    <main
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4 py-12"
      style={{ backgroundImage: 'url("/image6.jpg")' }}
    >
      <div className="relative z-10 w-full max-w-2xl bg-black/80 text-white backdrop-blur-md rounded-xl shadow-xl p-8 border border-gray-700 transition-all -mt-20">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight">
            ✨ AI Blog Summariser
          </h1>
          <p className="mt-2 text-gray-300">
            Paste any blog URL to get a clean AI-powered summary and Urdu translation.
          </p>
        </header>

        <BlogForm />
      </div>
    </main>
  )
}
