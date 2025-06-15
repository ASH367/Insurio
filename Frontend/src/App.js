import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserForm from './Components/User/UserDetails';
import ChatPage from "./Components/Chat/ChatPage";

function App() {
  // Initialize userData from localStorage if present
  const [userData, setUserData] = useState(() => {
    const saved = localStorage.getItem('userData');
    return saved ? JSON.parse(saved) : null;
  });

  // Save userData to localStorage whenever it changes
  useEffect(() => {
    if (userData) {
      localStorage.setItem('userData', JSON.stringify(userData));
    }
  }, [userData]);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<UserForm onSubmit={setUserData} />}
        />
        <Route
          path="/chat"
          element={<ChatPage userData={userData} />}
        />
      </Routes>
    </Router>
  )
}

export default App;
