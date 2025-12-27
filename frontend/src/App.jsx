import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashbord from './pages/Dashbord'
import Navbar from './components/Navbar'
// import Community from './pages/Community'
import CareerSwap from './pages/CareerSwap'
// import Roadmap from './pages/RoadmapPage'
// import RoadmapFlow from './components/RoadmapFlow'

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Navbar><Dashbord /></Navbar>} />
        <Route path="/careerswap" element={<Navbar><CareerSwap /></Navbar>} />
        {/* <Route path="/community" element={<Navbar><Community /></Navbar>} />
        <Route path="/roadmap" element={<Navbar><Roadmap /></Navbar>} />
        <Route path="/flow" element={<Navbar><RoadmapFlow /></Navbar>} /> */}





      </Routes>

    </>
  )
}

export default App