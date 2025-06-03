"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { FaBars, FaTimes, FaUser, FaBell, FaEnvelope } from "react-icons/fa"

function Navbar() {
  const { currentUser, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/")
    setIsMenuOpen(false)
  }

  return (
    <nav className="bg-primary-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold">
            Accesibilitate
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/articles" className="hover:text-primary-200 transition-colors">
              Articole
            </Link>
            <Link to="/hospitals" className="hover:text-primary-200 transition-colors">
              Spitale
            </Link>
            <Link to="/faq" className="hover:text-primary-200 transition-colors">
              FAQ
            </Link>
            {currentUser && (
              <>
                <Link to="/groups" className="hover:text-primary-200 transition-colors">
                  Grupuri
                </Link>
                <Link to="/events" className="hover:text-primary-200 transition-colors">
                  Evenimente
                </Link>
              </>
            )}
            {isAdmin && (
              <Link to="/admin" className="hover:text-primary-200 transition-colors">
                Admin
              </Link>
            )}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <>
                <Link to="/notifications" className="hover:text-primary-200 transition-colors" aria-label="Notificări">
                  <FaBell />
                </Link>
                <Link to="/messages" className="hover:text-primary-200 transition-colors" aria-label="Mesaje">
                  <FaEnvelope />
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-1 focus:outline-none">
                    <FaUser />
                    <span>{currentUser.nume}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-800 hover:bg-primary-100 transition-colors"
                    >
                      Profil
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-primary-100 transition-colors"
                    >
                      Deconectare
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-md bg-white text-primary-600 hover:bg-primary-100 transition-colors"
                >
                  Autentificare
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-md border border-white hover:bg-primary-500 transition-colors"
                >
                  Înregistrare
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-primary-500">
            <div className="flex flex-col space-y-4">
              <Link
                to="/articles"
                className="hover:text-primary-200 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Articole
              </Link>
              <Link
                to="/hospitals"
                className="hover:text-primary-200 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Spitale
              </Link>
              <Link to="/faq" className="hover:text-primary-200 transition-colors" onClick={() => setIsMenuOpen(false)}>
                FAQ
              </Link>
              {currentUser && (
                <>
                  <Link
                    to="/groups"
                    className="hover:text-primary-200 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Grupuri
                  </Link>
                  <Link
                    to="/events"
                    className="hover:text-primary-200 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Evenimente
                  </Link>
                  <Link
                    to="/notifications"
                    className="hover:text-primary-200 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Notificări
                  </Link>
                  <Link
                    to="/messages"
                    className="hover:text-primary-200 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mesaje
                  </Link>
                  <Link
                    to="/profile"
                    className="hover:text-primary-200 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profil
                  </Link>
                </>
              )}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="hover:text-primary-200 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
              {currentUser ? (
                <button onClick={handleLogout} className="text-left hover:text-primary-200 transition-colors">
                  Deconectare
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="hover:text-primary-200 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Autentificare
                  </Link>
                  <Link
                    to="/register"
                    className="hover:text-primary-200 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Înregistrare
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
