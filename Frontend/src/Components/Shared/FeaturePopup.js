import React from "react";

const FeaturePopup = ({ onClose }) => {
  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <h3 style={{ marginBottom: "10px" }}>🚧 Coming Soon!</h3>
        <p>This feature is yet to be implemented.</p>
        <button onClick={onClose} style={styles.button}>
          Close
        </button>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  popup: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
    textAlign: "center",
    minWidth: "250px",
  },
  button: {
    marginTop: "12px",
    padding: "8px 16px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#000",
    color: "#fff",
    cursor: "pointer",
  },
};

export default FeaturePopup;
