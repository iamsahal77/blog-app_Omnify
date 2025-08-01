import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Blog from './pages/Blog'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Newsletter from './components/NewsLetter'  
import Footer from './components/Footer'

function App() {
  return (
    <Router>
      <div className="bg-gray-100 min-h-screen">
          <Navbar />
          <main className="pt-16"> 
              <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
            
              </Routes>
          </main>
          <Newsletter/>
          <Footer/>
      </div>
    </Router>
  );
};

export default App;
