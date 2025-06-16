import React, { useState, useRef, useEffect } from 'react';
import { ArrowUpIcon, Microphone, Paperclip } from "@phosphor-icons/react";
import Frame5 from "../../assets/Images/Frame5.png";
import axios from "axios";
import ReactMarkdown from 'react-markdown';
import remarkGfm from "remark-gfm";
import { AnimatePresence, motion } from 'framer-motion';
import FeaturePopup from "../Shared/FeaturePopup";
import { saveMessageToHistory, getChatHistory } from "../../utils/chatHistory";

const Middle = ({ formData, sessionId }) => {
  const [selected, setSelected] = useState("Search");
  const options = ['Search', 'Recommend', 'Compare'];
  const [message, setMessage] = useState("");
  const chatContainerRef = useRef(null);
  const lastUserMsgRef = useRef(null);
  const lastBotMsgRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [inputFocused, setInputFocused] = useState(false);
  const [isGeneratingRecommendation, setIsGeneratingRecommendation] = useState(false);
  const inputRef = useRef(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const history = getChatHistory();
    setChatHistory(history);
  }, []);

  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;
  
    // Use setTimeout to ensure DOM updated
    setTimeout(() => {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth"
      });
    }, 50);
  }, [chatHistory]);

  const handleClick = () => setShowPopup(true);

  const handleRecommendationClick = async () => {
    setIsGeneratingRecommendation(true);
    try {
      setChatHistory(prev => [
        ...prev,
        { sender: "user", text: "Show me personalized recommendations" },
        { sender: "bot", text: "Analyzing your profile..." }
      ]);
      saveMessageToHistory({ sender: "user", text: "Show me personalized recommendations" });

      console.log(formData);
      console.log("here");
      
      
      const payload = {
        income: 100000,
        age: parseInt(formData.age, 10),
        gender: formData.gender,
        uses_tobacco: formData.useOfTobacco === 'Daily user',
        zipcode: formData.zip,
        state: formData.state.toUpperCase(),
        year: 2025,
        countyfips: "04013",
        sessionId: sessionId
      };

      const response = await axios.post("https://insurio.onrender.com/marketplace-plans", payload);
      const { available, recommendation, message, link } = response.data;
      let finalRecommendation = available === false && link
        ? `${message}\n\nExplore plans at: ${link}`
        : recommendation || "No recommendations available at this time.";
      
      setChatHistory(prev => [
        ...prev.slice(0, -1),
        { sender: "bot", text: finalRecommendation, raw: recommendation }
      ]);
      saveMessageToHistory({ sender: "bot", text: finalRecommendation, raw: recommendation });
    } catch (error) {
      console.log("Error:" , error)
      setChatHistory(prev => [
        ...prev.slice(0, -1),
        { sender: "bot", text: "Failed to load recommendations. Please try again later." }
      ]);
    } finally {
      setIsGeneratingRecommendation(false);
    }
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage = message;
    setLoading(true);

    const updatedHistory = [
      ...chatHistory,
      { sender: "user", text: userMessage, raw: userMessage }
    ];
    setChatHistory(updatedHistory);
    saveMessageToHistory({ sender: "user", text: userMessage, raw: userMessage });
    setMessage("");
    setInputFocused(false);

    try {
      const chatContext = [];
      let lastRole = null;
      updatedHistory.slice(-5).forEach(msg => {
        const role = msg.sender === "user" ? "user" : "assistant";
        if (role !== lastRole) {
          chatContext.push({
            role,
            content: msg.raw || (typeof msg.text === 'string' ? msg.text : msg.text?.props?.children?.[0] || '')
          });
          lastRole = role;
        }
      });
      if (chatContext.length > 0 && chatContext[chatContext.length - 1].role === "user") {
        chatContext.pop();
      }

      const payload = {
        message: userMessage,
        context: chatContext,
        userData: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          age: parseInt(formData.age, 10) || null,
          gender: formData.gender,
          uses_tobacco: formData.useOfTobacco === 'Daily user',
          zipcode: formData.zip,
          state: formData.state.toUpperCase()
        },
        sessionId: sessionId
      };

      const res = await axios.post("https://insurio.onrender.com/chat-with-ai", payload);
      const botReply = res.data.reply || "No response received.";
      setChatHistory(prev => [...prev, { sender: "bot", text: botReply, raw: botReply }]);
      saveMessageToHistory({ sender: "bot", text:botReply , raw: botReply });
    } catch (error) {
      console.log("Api Error:", error)
      const errorMsg = error.response?.data?.error?.message || "Something went wrong. Please try again.";
      setChatHistory(prev => [...prev, { sender: "bot", text: errorMsg }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleOptionClick = (option) => {
    setSelected(option);
    if (option === "Recommend") handleRecommendationClick();
    if (option === "Compare") handleClick();
  };

  const shouldShowWelcome = !inputFocused && chatHistory.length === 0 && !message.trim();

  return (
    <div style={{ borderRadius: "12px", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", backgroundColor: "#FAFAFA", height: "96vh", width: "100%", backdropFilter: "blur(32px)", marginTop: "20px", marginBottom: "20px", position: "relative", overflow: "hidden" }}>
      <div style={{ display: "flex", marginTop: "30px", justifyContent: "center" }}>
        <img src={Frame5} style={{ width: '18px', height: '18px', marginTop: "2.5px" }} alt="Logo" />
        <div style={{ fontSize: "18px", marginLeft: "6px" }}>Insurio</div>
      </div>

      <div ref={chatContainerRef} style={{ maxHeight: "65vh", overflowY: "auto", padding: "0 24px", marginTop: "20px",  width:"50%", marginLeft:"auto", marginRight:"auto"}}>
        <AnimatePresence>
          {shouldShowWelcome && (
            <motion.div initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }} transition={{ duration: 0.4, ease: "easeInOut" }} style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", marginTop: "100px" }}>
              <img src={Frame5} style={{ width: '22px', height: '22px' }} alt="icon" />
              <div style={{ color: "#A0A0A0", fontSize: "16px", marginTop: "8px" }}>Welcome to Insurio {formData.firstName}</div>
              <div style={{ color: "#000000", fontSize: "38px", marginTop: "8px" }}>How can I Help ?</div>
              {loading && <div style={{ marginTop: "20px", color: "#A0A0A0" }}>Thinking...</div>}
            </motion.div>
          )}
        </AnimatePresence>
        

        <div
  style={{
    maxHeight: "100vh",
    overflowY: "auto",
    scrollbarWidth: "0px",            // Firefox
    msOverflowStyle: "none",           // IE 10+
  }}
  className="chat-container"
>
  <div
    style={{
      display: "flex",
      flexDirection: "column",
    }}
  >
        {chatHistory.map((msg, index) => {
          const isLastUser = index === chatHistory.length - 2 && msg.sender === "user";
          const isLastBot = index === chatHistory.length - 1 && msg.sender === "bot";
          const bgColor = "#E6F0FF"

          return (
            <div key={index} ref={isLastUser ? lastUserMsgRef : isLastBot ? lastBotMsgRef : null} style={{ textAlign: msg.sender === "user" ? "right" : "left", margin: "3px 0"}}>
              <span style={{ display: "inline-block", backgroundColor: msg.sender === "user" ? "#F0F0F0" : "#FAFAFA", color: "#000000", paddingRight: "25px", paddingLeft: "25px", borderRadius: msg.sender === "user" ? "30px" : "0", maxWidth: "80%", fontSize: "15px", boxShadow:msg.sender === "user" ?  "0 2px 4px rgba(0,0,0,0.1)":"0", lineHeight: "1.2" }}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
              </span>
            </div>
          );
        })}
          </div>
          </div>
      </div>

      <div style={{ paddingLeft: "12px", paddingRight: "12px", backgroundColor: "#F0F0F0", borderRadius: "12px", position: "fixed", bottom: "6%", left: "50%", transform: "translateX(-50%)", width: "40%", border: "1px solid #E0E0E0" }}>
        <div style={{ display: "flex", marginBottom: 0, marginTop: "14px" }}>
          <textarea rows={2} disabled={loading} ref={inputRef} value={message} onChange={(e) => setMessage(e.target.value)} onFocus={() => setInputFocused(true)} onBlur={() => setTimeout(() => setInputFocused(false), 100)} onKeyDown={handleKeyDown} placeholder="Insurance Related Queries " style={{ flex: 1, borderRadius: "8px", backgroundColor: "#f0f0f0", marginRight: "10px", border: "none", fontSize: "16px", color: "#000000", transition: "background 0.3s", outline: "none",resize: "none" }} />
          <div onClick={handleSend} style={{ width: "26px", height: "26px", borderRadius: "100px", background: loading ? "#ccc" :"#000000", color: "#A0A0A0", border: "none", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: loading ? "none" : "auto", }}>
          {loading ? (
    <motion.div
      style={{
        border: "3px solid #f3f3f3",
        borderTop: "3px solid #000",
        borderRadius: "50%",
        width: "18px",
        height: "18px",
      }}
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
    />
  ) : (
    <ArrowUpIcon size={20} color="#FFF" weight="bold" />
  )}
          </div>
        </div>

        <div style={{ display: "flex", gap: "8px", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: "8px", justifyContent: "flex-start" }}>
            {options.map((label) => {
              const isSelected = selected === label;
              return (
                <p key={label} onClick={() => handleOptionClick(label)} style={{ border: "1px solid", borderColor: isSelected ? "#ECB26B3D" : "#E0E0E0", marginBottom: "12px", marginTop: "21px", textAlign: "center", padding: "10px 16px", color: isSelected ? "#ECB26B" : "#A0A0A0", borderRadius: "10px", backgroundColor: isSelected ? "rgba(236, 178, 107, 0.24)" : "#FAFAFA", cursor: isGeneratingRecommendation ? 'not-allowed' : 'pointer', opacity: isGeneratingRecommendation ? 0.6 : 1, display: "flex", alignItems: "center", fontSize: "16px", transition: "all 0.3s", userSelect: "none" }}>
                  {label}
                </p>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: "8px", justifyContent: "flex-start" }}>
            <div style={{ display: "flex", alignItems: "center", marginTop: "21px", padding: "10px 0", marginBottom: "12px", cursor: "pointer" }} onClick={handleClick}>
              <Microphone size={20} color="#A0A0A0" weight='fill' />
            </div>
            <div style={{ display: "flex", alignItems: "center", marginTop: "21px", padding: "10px 0", marginBottom: "12px", cursor: "pointer" }} onClick={handleClick}>
              <Paperclip size={20} color="#A0A0A0" />
            </div>
          </div>
        </div>
      </div>
      {showPopup && <FeaturePopup onClose={() => setShowPopup(false)} />}
    </div>
  );
};

export default Middle;
