import perplexityLogo from "../Images/perplexityLogo.png"
import React, { useState } from 'react';
import {Folder, BookmarkSimple, DotOutlineIcon } from "@phosphor-icons/react";


const Right = (formData) => {
    const [selected, setSelected] = useState("sonar");

  const handleChange = (e) => {
    setSelected(e.target.value);
  };
    return (
      <div style={{width:"319px", margin:"24px"}}>
        <div>
            <div>
                <div style={{ position: "relative", width:"180px"}}>
                    <label style={{ fontSize: "20px", marginBottom: "8px", display: "block" }}>
                        Perplexity Model
                    </label>
                    <div
                        style={{
                            nmarginTop:"14px",
                            display: "flex",
                            alignItems: "center",
                            backgroundColor: "#FAFAFA",
                            border: "none",
                            borderRadius: "8px",
                            padding: "8px 12px",
                            cursor: "pointer",
                            position: "relative",
                        }}
                    >
                    <img
                        src={perplexityLogo}
                        alt="perplexity"
                        style={{ width: "20px", height: "20px" }}
                    />
                    {selected === "sonar"}
                    <select
                        value={selected}
                        onChange={handleChange}
                        style={{
                        flex: 1,
                        border: "none",
                        backgroundColor: "transparent",
                        fontSize: "16px",
                        color: "#333",
                        width:"100%",
                        paddingRight: "24px",
                        cursor: "pointer",
                        }}
                    >
                    <option value="sonar">sonar</option>
                    <option value="sonar-pro">sonar-pro</option>
                    <option value="sonar-reasoning">sonar-reasoning</option>
                    <option value="sonar-reasoning-pro">sonar-reasoning-pro</option>
                    <option value="sonar-deep-research">sonar-deep-research</option>
                    </select>
                    </div>
                </div>
            </div>
        </div>

        <div>
            <div style={{fontSize:"20px", marginTop:"45px"}}>
                Collections
            </div>
            <div style={{display:"flex",marginTop:"16px",alignContent:"center"}}>
                <div>
                    <Folder size={18} color="#121212" />    
                </div>
                <div style={{marginLeft:"4px", size:"16px"}}>
                    Elderly coverage
                </div>
            </div>
            <div style={{display:"flex",marginTop:"12px",justifyContent:"flex-start", color:"#A0A0A0"}}>
                <div>
                    <DotOutlineIcon size={20} color="#A0A0A0" weight="fill"/>    
                </div>
                <div style={{marginLeft:"4px", size:"14px"}}>
                    My dad is 70 years,i ne...
                </div>
            </div>
            <div style={{display:"flex",marginTop:"8px", color:"#A0A0A0"}}>
                <div>
                    <DotOutlineIcon size={20} color="#A0A0A0" weight="fill"/>    
                </div>
                <div style={{marginLeft:"4px", size:"14px"}}>
                    What plan does suits the...
                </div>
            </div>

            <div style={{display:"flex",marginTop:"16px"}}>
                <div>
                    <Folder size={18} color="#121212" />    
                </div>
                <div style={{marginLeft:"4px", size:"16px"}}>
                    Myself
                </div>
            </div>
        </div>                
        
        <div>
            <div style={{fontSize:"20px", marginTop:"45px"}}>
                Saved
            </div>
            <div style={{display:"flex",marginTop:"12px",alignContent:"center", color:"#A0A0A0"}}>
                <div>
                <BookmarkSimple size={18} color="#A0A0A0" />    
                </div>
                <div style={{marginLeft:"4px", size:"14px"}}>
                    UnitedHealthcare
                </div>
            </div>
            <div style={{display:"flex",marginTop:"8px",alignContent:"center", color:"#A0A0A0"}}>
                <div>
                <BookmarkSimple size={18} color="#A0A0A0" /> 
                </div>
                <div style={{marginLeft:"4px", size:"14px"}}>
                    Aetna (CVS)
                </div>
            </div>
            <div style={{display:"flex",marginTop:"8px",alignContent:"center", color:"#A0A0A0"}}>
                <div>
                <BookmarkSimple size={18} color="#A0A0A0" /> 
                </div>
                <div style={{marginLeft:"4px", size:"14px"}}>
                    Oscar Health
                </div>
            </div>

        </div> 
      </div>
    );
  };
  
  export default Right;
  