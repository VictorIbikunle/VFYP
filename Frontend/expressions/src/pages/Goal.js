// App.js

import React, { useState, useEffect } from "react";

const Goal = ({ goalData, progressData = 0, isCompleted = false, onStatusChange, onDeleteGoal, setShowRewardsPopup }) => {
  const handleStatusChange = (status) => {
    if (!isCompleted) {
      let newProgress = 0;
      switch (status) {
        case "Doing well":
          newProgress = Math.min(progressData + 25, 100);
          break;
        case "Making progress":
          newProgress = Math.min(progressData + 50, 100);
          break;
        case "Reached goal":
          newProgress = 100;
          triggerRewardSystem();
          break;
        default:
          break;
      }
      onStatusChange(goalData._id, newProgress, newProgress === 100);
    }
  };

  const triggerRewardSystem = () => {
    console.log("Reward system triggered!");
    setShowRewardsPopup(true); // Show rewards popup when the system is triggered
  };

  return (
    <div>
      <h3>{goalData.name}</h3>
      <p>{goalData.description}</p>
      <p>Start Date: {goalData.startDate}</p>
      <p>End Date: {goalData.endDate}</p>
      <div style={{ width: "100%", backgroundColor: "#ddd", marginTop: "10px" }}>
        <div
          style={{
            width: `${progressData}%`,
            height: "20px",
            backgroundColor: isCompleted ? "#4CAF50" : "#2196F3",
            textAlign: "center",
            lineHeight: "20px",
            color: "white",
          }}
        >
          {isCompleted ? "Completed" : `${progressData}%`}
        </div>
      </div>
      <div>
        <button onClick={() => handleStatusChange("Doing well")} disabled={isCompleted}>Doing well</button>
        <button onClick={() => handleStatusChange("Making progress")} disabled={isCompleted}>Making progress</button>
        <button onClick={() => handleStatusChange("Reached goal")} disabled={isCompleted}>Reached goal</button>
        <button onClick={() => onDeleteGoal(goalData._id)}>Delete Goal</button>
      </div>
    </div>
  );
};

const App = () => {
  const [goals, setGoals] = useState([]);
  const [goalData, setGoalData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: ""
  });

  const [showRewardsPopup, setShowRewardsPopup] = useState(false); // State for showing rewards popup

  useEffect(() => {
    fetch("http://localhost:5000/get_goals")
      .then(response => response.json())
      .then(data => setGoals(data.map(g => ({...g, progressData: g.progressData || 0, isCompleted: g.isCompleted || false}))))
      .catch(error => console.error('Error fetching goals:', error));
  }, []);

  const handleGoalSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/save_goal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ goal: goalData })
      });
      if (response.ok) {
        const newGoal = await response.json();
        setGoals([...goals, { ...goalData, progressData: 0, isCompleted: false, _id: newGoal.goal_id }]);
        setGoalData({ name: "", description: "", startDate: "", endDate: "" });
      } else {
        throw new Error('Failed to save the goal');
      }
    } catch (error) {
      console.error("Error saving goal:", error);
    }
  };

  return (
    <div>
      <h1>Goal Tracker</h1>
      {goals.map((goal, index) => (
        <Goal
          key={goal._id || index}
          goalData={goal}
          progressData={goal.progressData}
          isCompleted={goal.isCompleted}
          onStatusChange={(goalId, newProgress, completed) => {
            const updatedGoals = goals.map(g =>
              g._id === goalId ? { ...g, progressData: newProgress, isCompleted: completed } : g);
            setGoals(updatedGoals);
          }}
          onDeleteGoal={(goalId) => {
            setGoals(goals.filter(g => g._id !== goalId));
          }}
          setShowRewardsPopup={setShowRewardsPopup} // Pass setShowRewardsPopup to Goal component
        />
      ))}
      <form onSubmit={handleGoalSubmit}>
        <input type="text" placeholder="Goal Name" value={goalData.name} onChange={(e) => setGoalData({...goalData, name: e.target.value})} />
        <input type="text" placeholder="Description" value={goalData.description} onChange={(e) => setGoalData({...goalData, description: e.target.value})} />
        <input type="date" value={goalData.startDate} onChange={(e) => setGoalData({...goalData, startDate: e.target.value})} />
        <input type="date" value={goalData.endDate} onChange={(e) => setGoalData({...goalData, endDate: e.target.value})} />
        <button type="submit">Create Goal</button>
      </form>
      {showRewardsPopup && (
        <div className="rewards-popup">
          {/* Rewards content */}
          <h2>Congratulations! You've unlocked a reward!</h2>
          <button onClick={() => setShowRewardsPopup(false)}>Close</button> {/* Button to close popup */}
        </div>
      )}
    </div>
  );
};

export default App;
