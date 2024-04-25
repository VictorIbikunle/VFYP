import React from "react";

const Emoticon = ({ emotion }) => {
 
  const emoticons = {
    happy: "😊",
    sad: "😢",
    neutral: "😐",
  };

  return (
    <span role="img" aria-label={emotion}>
      {emoticons[emotion]}
    </span>
  );
};

export default Emoticon;
