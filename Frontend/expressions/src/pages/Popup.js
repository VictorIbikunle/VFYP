import React from "react";
import "./Popup.css";
import Emoticon from "./Emoticon";

const Popup = ({ emotion, content, onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <div className="popup-header">
          <h3>{emotion.toUpperCase()} Emotion</h3>
          <span className="close-btn" onClick={onClose}>
            &times;
          </span>
        </div>
        <div className="popup-body">
          <div className="emoticon">
            <Emoticon emotion={emotion} />
          </div>
          <p>{content}</p>
        </div>
      </div>
    </div>
  );
};

export default Popup;
