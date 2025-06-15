import { Plus, List, GearIcon } from "@phosphor-icons/react";
import React, { useState } from 'react';
import FeaturePopup from "../Shared/FeaturePopup";
import { createNewSessionId } from "../../utils/session";

const Left = ({onSessionReset,formData}) => {
  const [showPopup, setShowPopup] = useState(false);
  const handleClick = () => {
    setShowPopup(true);
  };
  const handleNewSession = (newSessionId) => {
    if (onSessionReset) {
      onSessionReset(newSessionId); // inform parent
    } 
  };
    return (
      <div style={{width:"71px", textAlign: 'center', marginTop:"36px"}}>
        <div
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "100px",
              background: "#000000",
              color: "#A0A0A0",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign:"center",
              margin: "0 auto"
            }}
            onClick={handleNewSession}
          >
            <Plus size={20} color="#FFF" weight="bold" />
          </div>
          <div style={{marginTop:"24px", cursor: "pointer"}} onClick={handleClick}>
          <List size={19} color="#A0A0A0" weight="fill"/>
          </div>
          <div style={{marginTop:"20px", cursor: "pointer"}} onClick={handleClick}>
          <GearIcon size={19} color="#A0A0A0" weight="fill" />
          </div>
          {showPopup && <FeaturePopup onClose={() => setShowPopup(false)} />}
      </div>
    );
  };
  
  export default Left;