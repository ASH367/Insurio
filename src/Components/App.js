import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import FormPage from './userDetails'
import ChatPage from './chatpage'

function App() {
  const [userData, setUserData] = useState(null)
  console.log(userData)
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<FormPage onSubmit={setUserData} />}
        />
        <Route
          path="/chat"
          element={<ChatPage userData={userData} />}
        />
      </Routes>
    </Router>
  )
}

export default App
