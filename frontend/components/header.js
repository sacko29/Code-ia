import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '../contexts/AuthContext'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/')
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    }
  }

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">LC</span>
          </div>
          <span className="font-bold text-xl text-gray-800">LovableClone</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/features" className="text-gray-600 hover:text-purple-600 transition-colors">
            Fonctionnalités
          </Link>
          <Link href="/pricing" className="text-gray-600 hover:text-purple-600 transition-colors">
            Tarifs
          </Link>
          <Link href="/blog" className="text-gray-600 hover:text-purple-600 transition-colors">
            Blog
          </Link>
          
          {user ? (
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-gray-600 hover:text-purple-600 transition-colors">
                Tableau de bord
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-md text-gray-600 hover:text-purple-600 transition-colors"
              >
                Déconnexion
              </button>
              <Link href="/account">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white font-semibold cursor-pointer">
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                </div>
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-gray-600 hover:text-purple-600 transition-colors">
                Connexion
              </Link>
              <Link href="/signup" className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-md hover:shadow-lg transition-shadow">
                Inscription
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile menu button */}
        <button 
          className="md:hidden flex flex-col space-y-1.5"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className={`block w-6 h-0.5 bg-gray-800 transition-transform ${isMenuOpen ? 'transform rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-gray-800 transition-opacity ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
          <span className={`block w-6 h-0.5 bg-gray-800 transition-transform ${isMenuOpen ? 'transform -rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute top-full left-0 right-0">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link href="/features" className="text-gray-600 hover:text-purple-600 transition-colors py-2">
              Fonctionnalités
            </Link>
            <Link href="/pricing" className="text-gray-600 hover:text-purple-600 transition-colors py-2">
              Tarifs
            </Link>
            <Link href="/blog" className="text-gray-600 hover:text-purple-600 transition-colors py-2">
              Blog
            </Link>
            
            {user ? (
              <>
                <Link href="/dashboard" className="text-gray-600 hover:text-purple-600 transition-colors py-2">
                  Tableau de bord
                </Link>
                <Link href="/account" className="text-gray-600 hover:text-purple-600 transition-colors py-2">
                  Mon compte
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-left text-gray-600 hover:text-purple-600 transition-colors py-2"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 hover:text-purple-600 transition-colors py-2">
                  Connexion
                </Link>
                <Link href="/signup" className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-md text-center">
                  Inscription
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
