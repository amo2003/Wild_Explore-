import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AnimalProvider } from './context/AnimalContext'
import { LanguageProvider } from './context/LanguageContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Animals from './pages/Animals'
import AnimalDetail from './pages/AnimalDetail'
import AddAnimal from './pages/AddAnimal'
import EditAnimal from './pages/EditAnimal'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AnimalProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/animals" element={<Animals />} />
            <Route path="/animals/:id" element={<AnimalDetail />} />
            <Route path="/animals/:id/edit" element={<EditAnimal />} />
            <Route path="/add" element={<AddAnimal />} />
          </Routes>
        </AnimalProvider>
      </LanguageProvider>
    </BrowserRouter>
  )
}
