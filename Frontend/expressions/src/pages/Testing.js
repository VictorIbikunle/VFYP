import React, { useState } from "react";
import Emoticon from "./Emoticon";
import "./Testing.css";
import "./Popup.css";

const Testing = () => {
  const questions = [
    "Q1. Do you prioritize self-care regularly?",
    "Q2. Are you seeking support when needed?",
    "Q3. Are you practicing mindfulness?",
    "Q4. Do you express emotions comfortably?",
    "Q5. Do you sleep often?",
    "Q6. Are you celebrating achievements?",
    "Q7. Do you think it's okay to cry?",
    "Q8. Do you have healthy coping methods?",
    "Q9. Do you prefer to be alone most of the time?",
    "Q10. Do you pursue activities for joy?",
  ];

  const solutions = [
    "Prioritizing self-care can improve overall well-being. Consider setting aside time each day for activities you enjoy.",
    "Seeking support from friends, family, or a therapist can provide valuable assistance during challenging times.",
    "Practicing mindfulness techniques such as meditation or deep breathing can help reduce stress and improve mental clarity.",
    "Expressing emotions openly and honestly can lead to better communication and deeper connections with others.",
    "Getting enough sleep is essential for physical and mental health. Aim for 7-9 hours of quality sleep each night.",
    "Celebrating achievements, no matter how small, can boost self-confidence and motivation.",
    "Crying is a natural and healthy way to release emotions. Allow yourself to express your feelings without judgment.",
    "Developing healthy coping methods, such as exercise or journaling, can help manage stress and improve resilience.",
    "While alone time can be valuable, it's important to balance solitude with social connections and support networks.",
    "Engaging in activities that bring joy and fulfillment can enhance overall happiness and well-being.",
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [story, setStory] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [negativeAnswers, setNegativeAnswers] = useState([]);

  const handleOptionChange = (question, selectedOption) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [question]: selectedOption,
    }));
  };

  const handleNextQuestion = () => {
    setCurrentQuestion((prevQuestion) => prevQuestion + 1);
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestion((prevQuestion) => prevQuestion - 1);
  };

  const handleSubmit = () => {
    console.log("Submitted Answers:", answers);
    analyzeAnswers();
    generateStory();
  };

  const analyzeAnswers = () => {
    const noAnswers = Object.entries(answers).filter(
      ([question, answer]) => answer === "Option 2"
    );
    setNegativeAnswers(noAnswers);
    
    const yesCount = Object.values(answers).filter(
      (answer) => answer === "Option 1"
    ).length;
    const noCount = Object.values(answers).filter(
      (answer) => answer === "Option 2"
    ).length;
    const notSureCount = Object.values(answers).filter(
      (answer) => answer === "Option 3"
    ).length;

    if (yesCount >= 5) {
      setResult("Patient is generally happy!");
    } else if (noCount >= 5) {
      setResult(
        "Patient might be facing some challenges. Make sure to continuously check up on them."
      );
    } else {
      setResult("Your responses are balanced. It's okay to seek support if needed.");
    }
  };

  const generateStory = () => {
    const dominantEmotion = calculateDominantEmotion();
    
    switch (dominantEmotion) {
      case "happy":
        setStory("Patient seem to be in a good mood. Keep spreading positivity!");
        break;
      case "sad":
        setStory("It looks like patient feeling down. Remind them it's okay to seek support from friends or loved ones.");
        break;
      case "neutral":
        setStory("Patient is feeling neutral. They should take some time for self-reflection and self-care.");
        break;
      default:
        setStory("Patient emotions are mixed. Remember, it's okay to seek professional help if needed.");
        break;
    }

    setShowPopup(true);
  };

  const calculateDominantEmotion = () => {
    const yesCount = Object.values(answers).filter((answer) => answer === "Option 1").length;
    const noCount = Object.values(answers).filter((answer) => answer === "Option 2").length;
    const notSureCount = Object.values(answers).filter((answer) => answer === "Option 3").length;

    if (yesCount > noCount && yesCount > notSureCount) {
      return "happy";
    } else if (noCount > yesCount && noCount > notSureCount) {
      return "sad";
    } else {
      return "neutral";
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="Testing">
      <h2>{questions[currentQuestion]}</h2>

      <div className="question">
        <label>
          <input
            type="radio"
            value="Option 1"
            checked={answers[questions[currentQuestion]] === "Option 1"}
            onChange={() =>
              handleOptionChange(questions[currentQuestion], "Option 1")
            }
          />
          Yes
        </label>
        <label>
          <input
            type="radio"
            value="Option 2"
            checked={answers[questions[currentQuestion]] === "Option 2"}
            onChange={() =>
              handleOptionChange(questions[currentQuestion], "Option 2")
            }
          />
          No
        </label>
        <label>
          <input
            type="radio"
            value="Option 3"
            checked={answers[questions[currentQuestion]] === "Option 3"}
            onChange={() =>
              handleOptionChange(questions[currentQuestion], "Option 3")
            }
          />
          Not Sure
        </label>
      </div>

      {currentQuestion > 0 && (
        <button onClick={handlePreviousQuestion}>Previous Question</button>
      )}

      {currentQuestion < 9 && (
        <button onClick={handleNextQuestion}>Next Question</button>
      )}

      {currentQuestion === 9 && (
        <div>
          <button onClick={handleSubmit}>Submit</button>
          {result && <p>{result}</p>}
          {negativeAnswers.length > 0 && (
  <div>
    <h3>Areas to Improve:</h3>
    <ul>
      {negativeAnswers.map(([question, answer], index) => (
        <li key={index}>
          <strong>{question}</strong>: {solutions[questions.indexOf(question)]}
        </li>
      ))}
    </ul>
  </div>
)}

        </div>
      )}

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <div className="popup-header">
              <h3>Emotion</h3>
              <button className="close-btn" onClick={handleClosePopup}>x</button>
            </div>
            <div className="popup-body">
              <Emoticon emotion={calculateDominantEmotion()} />
              <p>{story}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Testing;
