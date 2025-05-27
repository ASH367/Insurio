import { Plus, List, GearIcon } from "@phosphor-icons/react";

const Left = (formData) => {
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
          >
            <Plus size={20} color="#FFF" weight="bold" />
          </div>
          <div style={{marginTop:"24px"}}>
          <List size={19} color="#A0A0A0" weight="fill"/>
          </div>
          <div style={{marginTop:"20px"}}>
          <GearIcon size={19} color="#A0A0A0" weight="fill" />
          </div>
      </div>
    );
  };
  
  export default Left;