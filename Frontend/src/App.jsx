import { useState } from 'react'
import { BrowserRouter, Route, Routes, } from 'react-router-dom'
import './App.css'
import Signup from './Components/Signup'
import Login from './Components/Login'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/Login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
