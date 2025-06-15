import { useLocation, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import Left from "../MainPage/Left.js"
import Middle from "../MainPage/Middle.js"
import Right from "../MainPage/Right.js"
import { getOrCreateSessionId } from "../../utils/session.js";


function ChatPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state ||JSON.parse(localStorage.getItem("userData") || {});
  const [middleKey, setMiddleKey] = React.useState(0);
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    console.log(formData);
    console.log("there");


    const id = getOrCreateSessionId();
    setSessionId(id);
  },[]);

  useEffect(() => {
    if (!formData || Object.keys(formData).length === 0) {
      navigate('/', { replace: true });
    }
  }, [formData, navigate]);

  const resetMiddle = () => {
    setMiddleKey((prev) => prev + 1);
  };

  const resetSession = () => {
    const newId = getOrCreateSessionId(true); // ← now this forces a new one
    setSessionId(newId);
    resetMiddle(); // re-render middle component
  };

  return (
    <div style={{display:"flex", justifyContent:"space-between", backdropFilter: 'blur(8px)'}}>
      <Left onReset={resetMiddle}  onSessionReset={resetSession} formData={formData} sessionId={sessionId}/>
      <Middle key={middleKey} formData={formData} sessionId={sessionId}/>
      <Right formData={formData} sessionId={sessionId}/>
    </div>
  );
}

export default ChatPage;