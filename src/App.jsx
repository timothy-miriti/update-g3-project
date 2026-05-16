import { NavLink, Route, Routes } from 'react-router-dom'
import './App.css'
import About from './pages/About'
import Home from './pages/Home'

function App() {
  return (
    <main className="app">
      <div className="route-links" aria-label="Primary navigation">
        <NavLink to="/">Movies</NavLink>
        <NavLink to="/about">About</NavLink>
      </div>
      <Routes>
        <Route element={<Home />} path="/" />
        <Route element={<About />} path="/about" />
      </Routes>
    </main>
  )
}

export default App
