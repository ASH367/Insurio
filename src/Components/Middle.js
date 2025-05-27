import React, { useState, useRef } from 'react';
import { ArrowUpIcon, Microphone, Paperclip } from "@phosphor-icons/react";
import Frame5 from "../Images/Frame5.png";
import axios from "axios";
import ReactMarkdown from 'react-markdown';
import { AnimatePresence, motion } from 'framer-motion';

const Middle = ({formData}) => {
    console.log("First name:", formData?.firstName || 'Not available');

  const [selected, setSelected] = useState("Search");
  const options = ['Search', 'Recommend', 'Cost Estimate'];
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [inputFocused, setInputFocused] = useState(false);
  const [isGeneratingRecommendation, setIsGeneratingRecommendation] = useState(false);

  const inputRef = useRef(null);
  const handleRecommendationClick = async () => {
    setIsGeneratingRecommendation(true);
    try {
      // Add user message to chat
      setChatHistory(prev => [
        ...prev,
        { sender: "user", text: "Show me personalized recommendations" },
        { sender: "bot", text: "Analyzing your profile..." }
      ]);

      // Prepare payload with hardcoded values
      const payload = {
        income: 100000,
        age: parseInt(formData.age,10),
        gender: formData.gender,
        uses_tobacco: formData.useOfTobaco === 'Daily user',
        zipcode: formData.zip,
        state: formData.state,
        year: 2025,
        countyfips: "04013"
      };

      // Directly call marketplace API for recommendations
      const response = await axios.post(
        "http://localhost:8000/marketplace-plans",
        payload
      );

      // Format the API response
      const recommendation = response.data.recommendation || 
        "No recommendations available at this time.";
      const formattedRecommendation = <ReactMarkdown>{recommendation}</ReactMarkdown>;

      // Update chat history with recommendation
      setChatHistory(prev => [
        ...prev.slice(0, -1), // Remove loading message
        { sender: "bot", text: formattedRecommendation }
      ]);

    } catch (error) {
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
    
    // Create updated history before state update
    const updatedHistory = [...chatHistory, { sender: "user", text: userMessage }];
    setChatHistory(updatedHistory);
    setMessage("");
    setInputFocused(false);
  
    try {
      // Prepare chat context - dynamically adjust based on message length
      const chatContext = updatedHistory
        .slice(-getOptimalContextLength(userMessage)) // Dynamic slicing
        .map(msg => ({
          role: msg.sender === "user" ? "user" : "assistant",
          content: typeof msg.text === 'string' ? msg.text : 
                   msg.text.props?.children || '' // Handle ReactMarkdown components
        }))
        .filter(msg => msg.content.trim().length > 0); // Remove empty messages
  
      const payload = {
        message: userMessage,
        context: chatContext,
        userData: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          age: parseInt(formData.age, 10) || null,
          gender: formData.gender,
          uses_tobacco: formData.useOfTobaco === 'Daily user',
          zipcode: formData.zip,
          state: formData.state
        }
      };
  
      const res = await axios.post("http://localhost:8000/chat-with-ai", payload);
  
      const botReply = res.data.reply || "No response received.";
      const refined = <ReactMarkdown>{botReply}</ReactMarkdown>;
      
      // Update with both user message and bot response
      setChatHistory(prev => [...prev, { sender: "bot", text: refined }]);
      setResponse(refined);
  
    } catch (error) {
      const errorMsg = error.response?.data?.error?.message || 
                      "Something went wrong. Please try again.";
      setChatHistory(prev => [...prev, { sender: "bot", text: errorMsg }]);
      setResponse(errorMsg);
    } finally {
      setLoading(false);
    }
  };
  const getOptimalContextLength = (currentMessage) => {
    const messageLength = currentMessage.length;
    
    if (messageLength > 500) return 0;    // Very long message - no context
    if (messageLength > 300) return 1;    // Long message - 1 previous message
    if (messageLength > 150) return 2;    // Medium message - 2 previous messages
    if (messageLength > 50) return 3;     // Short message - 3 previous messages
    return 4;                             // Very short message - 4 previous messages
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };
  const handleOptionClick = (option) => {
    setSelected(option);
    if (option === "Recommend") {
      handleRecommendationClick();
    }
  };

  const shouldShowWelcome =
    !inputFocused && chatHistory.length === 0 && !message.trim();

  return (
    <div
      style={{
        borderRadius: "12px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#FAFAFA",
        height: "96vh",
        width: "100%",
        backdropFilter: "blur(32px)",
        marginTop: "20px",
        marginBottom: "20px",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Logo Header */}
      <div style={{ display: "flex", marginTop: "30px", justifyContent: "center" }}>
        <img src={Frame5} style={{ width: '18px', height: '18px', marginTop: "2.5px" }} alt="Logo" />
        <div style={{ fontSize: "18px", marginLeft: "6px" }}>Insurio</div>
      </div>

      {/* Chat Area */}
      <div
        style={{
          maxHeight: "65vh",
          overflowY: "auto",
          padding: "0 24px",
          marginTop: "20px",
        }}
      >
        <AnimatePresence>
  {shouldShowWelcome && (
    <motion.div
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        marginTop: "100px"
      }}
    >
      <img src={Frame5} style={{ width: '22px', height: '22px' }} alt="icon" />
      <div style={{ color: "#A0A0A0", fontSize: "16px", marginTop: "8px" }}>Welcome to Insurio {formData.firstName}</div>
      <div style={{ color: "#000000", fontSize: "38px", marginTop: "8px" }}>How can I Help ?</div>
      {loading && <div style={{ marginTop: "20px", color: "#A0A0A0" }}>Thinking...</div>}
    </motion.div>
  )}
</AnimatePresence>

        {/* Chat Messages */}
        {chatHistory.map((msg, index) => (
            
          <div
            key={index}
            style={{
              textAlign: msg.sender === "user" ? "right" : "left",
              margin: "12px 0",
            }}
          >
            <span
              style={{
                display: "inline-block",
                backgroundColor: msg.sender === "user" ? "#DCF8C6" : "#FFFFFF",
                color: "#000000",
                padding: "10px 14px",
                borderRadius: "16px",
                maxWidth: "60%",
                fontSize: "15px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      {/* Input Bar */}
      <div
        style={{
          paddingLeft: "12px",
          paddingRight: "12px",
          backgroundColor: "#F0F0F0",
          borderRadius: "12px",
          position: "fixed",
          bottom: "6%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "40%",
          border: "1px solid #E0E0E0",
        }}
      >
        <div style={{ display: "flex", marginBottom: 0, marginTop: "14px" }}>
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setTimeout(() => setInputFocused(false), 100)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about any coverage"
            style={{
              flex: 1,
              borderRadius: "8px",
              backgroundColor: "#f0f0f0",
              marginRight: "10px",
              border: "none",
              fontSize: "16px",
              color: "#000000",
              transition: "background 0.3s",
              outline: "none",
            }}
          />
          <div
            onClick={handleSend}
            style={{
              width: "26px",
              height: "26px",
              borderRadius: "100px",
              background: "#000000",
              color: "#A0A0A0",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ArrowUpIcon size={20} color="#FFF" weight="bold" />
          </div>
        </div>

        {/* Clickable Options */}
        <div style={{ display: "flex", gap: "8px", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: "8px", justifyContent: "flex-start" }}>
            {options.map((label) => {
              const isSelected = selected === label;
              return (
                <p
                  key={label}
                  onClick={() => handleOptionClick(label)}
                  style={{
                    border: "1px solid",
                    borderColor: isSelected ? "#ECB26B3D" : "#E0E0E0",
                    marginBottom: "12px",
                    marginTop: "21px",
                    textAlign: "center",
                    padding: "10px 16px",
                    color: isSelected ? "#ECB26B" : "#A0A0A0",
                    borderRadius: "10px",
                    backgroundColor: isSelected ? "rgba(236, 178, 107, 0.24)" : "#FAFAFA",
                    cursor: isGeneratingRecommendation ? 'not-allowed' : 'pointer',
                    opacity: isGeneratingRecommendation ? 0.6 : 1,
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    transition: "all 0.3s",
                    userSelect: "none",
                    fontSize: "16px",
                  }}
                  disabled={isGeneratingRecommendation}
                >
                  {label}
                </p>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: "8px", justifyContent: "flex-start" }}>
            <div style={{ display: "flex", alignItems: "center", marginTop: "21px", padding: "10px 0", marginBottom: "12px" }}>
              <Microphone size={20} color="#A0A0A0" weight='fill' />
            </div>
            <div style={{ display: "flex", alignItems: "center", marginTop: "21px", padding: "10px 0", marginBottom: "12px" }}>
              <Paperclip size={20} color="#A0A0A0" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Middle;
