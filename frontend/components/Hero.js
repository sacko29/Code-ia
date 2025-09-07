import { useState } from 'react'
import Link from 'next/link'

const Hero = () => {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async (e) => {
    e.preventDefault()
    if (!prompt.trim()) return
    
    setIsGenerating(true)
    // Simulation de génération - à remplacer par l'appel API réel
    setTimeout(() => {
      setIsGenerating(false)
      // Redirection vers l'éditeur avec le prompt
      window.location.href = `/generate?prompt=${encodeURIComponent(prompt)}`
    }, 2000)
  }

  return (
    <section className="pt-32 pb-20 px-4 md:px-0">
      <div className="container mx-auto max-w-4xl text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Créez des applications avec <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">l'IA</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Décrivez simplement ce que vous voulez en langage naturel, et notre IA génère une application complète pour vous. Sans code, sans complexité.
        </p>

        <form onSubmit={handleGenerate} className="mb-12">
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ex: Crée une application de gestion de tâches avec un calendrier et des notifications"
              className="w-full md:w-96 px-6 py-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
              disabled={isGenerating}
            />
            <button
              type="submit"
              disabled={isGenerating || !prompt.trim()}
              className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Génération...
                </span>
              ) : (
                'Générer mon app'
              )}
            </button>
          </div>
        </form>

        <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
          <Link href="/demo" className="flex items-center text-purple-600 font-medium hover:underline">
            Voir une démo en direct
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          </Link>
          <Link href="/pricing" className="flex items-center text-gray-600 hover:text-gray-800 transition-colors">
            Découvrir nos formules
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Animated background elements */}
      <div className="absolute top-0 left-0 right-0 -z-10 overflow-hidden">
        <div className="absolute top-40 left-10 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-60 right-10 w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-80 left-1/2 w-72 h-72 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>
    </section>
  )
}

export default Hero
