import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AnimalProvider } from './context/AnimalContext'
import { LanguageProvider } from './context/LanguageContext'
import { AsgardeoProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import ScrollToTop from './components/ScrollToTop'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Animals from './pages/Animals'
import AnimalDetail from './pages/AnimalDetail'
import EditAnimal from './pages/EditAnimal'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import AnimalIdentifier from './pages/AnimalIdentifier'
import './App.css'

export default function App() {
  return (
    <AsgardeoProvider>
      <BrowserRouter>
        <LanguageProvider>
          <AnimalProvider>
            <ScrollToTop />
            <Routes>
              {/* ── Public routes (with Navbar) ── */}
              <Route path="/" element={<><Navbar /><Home /></>} />
              <Route path="/animals" element={<><Navbar /><Animals /></>} />
              <Route path="/animals/:id" element={<><Navbar /><AnimalDetail /></>} />
              <Route path="/about"    element={<><Navbar /><About /></>} />
              <Route path="/contact"  element={<><Navbar /><Contact /></>} />
              <Route path="/identify" element={<><Navbar /><AnimalIdentifier /></>} />
              <Route path="/login"    element={<Login />} />

              {/* ── Admin routes (no Navbar, Asgardeo protected) ── */}
              <Route path="/dashboard" element={
                <ProtectedRoute><Dashboard /></ProtectedRoute>
              } />
              <Route path="/dashboard/edit/:id" element={
                <ProtectedRoute><EditAnimal isDashboard /></ProtectedRoute>
              } />
            </Routes>
          </AnimalProvider>
        </LanguageProvider>
      </BrowserRouter>
    </AsgardeoProvider>
  )
}
