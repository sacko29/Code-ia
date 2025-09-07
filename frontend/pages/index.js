import Head from 'next/head'
import { useState, useEffect } from 'react'
import Header from '../components/Header'
import Hero from '../components/Hero'
import Features from '../components/Features'
import Demo from '../components/Demo'
import Testimonials from '../components/Testimonials'
import Pricing from '../components/Pricing'
import Footer from '../components/Footer'
import Loader from '../components/Loader'

export default function Home() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simuler un temps de chargement initial
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <Loader />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50">
      <Head>
        <title>LovableClone - Créez des applications avec l'IA</title>
        <meta name="description" content="Générez des applications full-stack simplement en décrivant ce que vous voulez en langage naturel. Sans code, sans complexité." />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Open Graph meta tags for social sharing */}
        <meta property="og:title" content="LovableClone - Créez des applications avec l'IA" />
        <meta property="og:description" content="Générez des applications full-stack simplement en décrivant ce que vous voulez en langage naturel." />
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:url" content="https://lovableclone.example.com" />
        <meta property="og:type" content="website" />
      </Head>

      <Header />
      <Hero />
      <Features />
      <Demo />
      <Testimonials />
      <Pricing />
      <Footer />
    </div>
  )
    }
