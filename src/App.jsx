import { useState } from 'react'
import HomePage from './components/HomePage'
import LandingPage from './components/LandingPage'
import BrowseView from './components/BrowseView'
import UploadView from './components/UploadView'
import AdminDashboard from './components/AdminDashboard'

function App() {
  const [currentView, setCurrentView] = useState('home') // 'home', 'auth', 'browse', 'upload', 'admin'
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  const handleGetStarted = () => {
    // Go directly to browse view as guest
    setCurrentView('browse')
  }

  const handleSignIn = () => {
    // Go to auth page
    setCurrentView('auth')
  }

  const handleAuthSuccess = (userRole = 'user') => {
    // User successfully logged in or registered
    setIsAuthenticated(true)
    
    // Check if admin (for demo: use email admin@example.com)
    if (userRole === 'admin') {
      setIsAdmin(true)
      setCurrentView('admin')
    } else {
      setIsAdmin(false)
      setCurrentView('browse')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setIsAdmin(false)
    setCurrentView('home')
  }

  const handleNavigateToAdmin = () => {
    if (isAdmin) {
      setCurrentView('admin')
    }
  }

  const handleNavigateToBrowse = () => {
    setCurrentView('browse')
  }

  const handleNavigateToUpload = () => {
    if (isAuthenticated) {
      setCurrentView('upload')
    } else {
      setCurrentView('auth')
    }
  }

  return (
    <>
      {currentView === 'home' && (
        <HomePage 
          onGetStarted={handleGetStarted} 
          onSignIn={handleSignIn}
        />
      )}

      {currentView === 'auth' && (
        <LandingPage 
          onAuthSuccess={handleAuthSuccess}
          onBack={() => setCurrentView('home')}
        />
      )}

      {currentView === 'browse' && (
        <BrowseView 
          isAuthenticated={isAuthenticated}
          onNavigateToUpload={handleNavigateToUpload}
          onSignIn={handleSignIn}
          onLogout={handleLogout}
        />
      )}

      {currentView === 'upload' && (
        <UploadView 
          onNavigateToBrowse={handleNavigateToBrowse}
          onLogout={handleLogout}
        />
      )}

      {currentView === 'admin' && (
        <AdminDashboard 
          onLogout={handleLogout}
          onNavigateToMain={handleNavigateToBrowse}
        />
      )}
    </>
  )
}

export default App
