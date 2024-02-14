// Testing.js
import React, { useState } from "react";
import "./Testing.css";

const Testing = () => {
  const questions = [
    "Q1. Do you have a good relationship with your?",
    "Q2. Do you spend a lot of time with friend?s",
    "Q3. Do you become angry quite easily?",
    "Q4. Are you scared easily?",
    "Q5. Do you sleep often?",
    "Q6. Do things irritate you easily?",
    "Q7. Do you think it's okay to cry",
    "Q8. Do new things scare you?",
    "Q9. Do you prefer to be alone most of the time?",
    "Q10. Do you like being surprised?",
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

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
  };

  const analyzeAnswers = () => {
    const yesCount = Object.values(answers).filter((answer) => answer === "Option 1").length;
    const noCount = Object.values(answers).filter((answer) => answer === "Option 2").length;
    const notSureCount = Object.values(answers).filter((answer) => answer === "Option 3").length;

    // Customize the messages based on the counts
    if (yesCount >= 5) {
      setResult("Patient is generally happy!");
    } else if (noCount >= 5) {
      setResult("Patient might be facing some challenges. Make sure to continously check up on them.");
    } else {
      setResult("Your responses are balanced. It's okay to seek support if needed.");
    }
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
        </div>
      )}
    </div>
  );
};

export default Testing;
