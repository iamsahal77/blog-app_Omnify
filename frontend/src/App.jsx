import { useState } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import Newsletter from './components/NewsLetter'
import Footer from './components/Footer'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar/>
        <HomePage/>
      </div>
      <Newsletter/>
      <Footer/>
    </Router>
  )
}

export default App
