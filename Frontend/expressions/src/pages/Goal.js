import React, { useState, useEffect } from 'react';

const Goal = ({ goalData, progressData, isCompleted, onStatusChange, onDeleteGoal }) => {
  const handleStatusChange = (status) => {
    if (!isCompleted) {
      let newProgress = 0;
      switch (status) {
        case 'Doing well':
          newProgress = Math.min(progressData + 25, 100);
          break;
        case 'Making progress':
          newProgress = Math.min(progressData + 50, 100);
          break;
        case 'Reached goal':
          newProgress = 100;
          onStatusChange(newProgress, true); // Pass true directly
          break;
        default:
          break;
      }

      console.log('New Progress Data:', newProgress);
      console.log('Is Completed:', isCompleted);
      onStatusChange(newProgress, isCompleted);
    }
  };

  return (
    <div>
      {goalData.name && (
        <div>
          <h3>{goalData.name}</h3>
          <p>{goalData.description}</p>
          <p>Start Date: {goalData.startDate}</p>
          <p>End Date: {goalData.endDate}</p>
          <div style={{ width: '100%', backgroundColor: '#ddd', marginTop: '10px' }}>
            <div
              style={{
                width: `${progressData}%`,
                height: '20px',
                backgroundColor: isCompleted ? '#4CAF50' : '#2196F3',
                textAlign: 'center',
                lineHeight: '20px',
                color: 'white',
              }}
            >
              {isCompleted ? 'Completed' : `${progressData}%`}
            </div>
          </div>
          <div>
            <button onClick={() => handleStatusChange('Doing well')} disabled={isCompleted}>
              Doing well
            </button>
            <button onClick={() => handleStatusChange('Making progress')} disabled={isCompleted}>
              Making progress
            </button>
            <button onClick={() => handleStatusChange('Reached goal')} disabled={isCompleted}>
              Reached goal
            </button>
            <button onClick={onDeleteGoal}>Delete Goal</button>
          </div>
        </div>
      )}
    </div>
  );
};

const App = () => {
  const [goals, setGoals] = useState([]);
  const [currentGoalIndex, setCurrentGoalIndex] = useState(0);

  const [goalData, setGoalData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
  });

  const [isCompleted, setIsCompleted] = useState(false);
  const [progressData, setProgressData] = useState(0);

  useEffect(() => {
    // Load goals from localStorage when the component mounts
    const storedGoals = JSON.parse(localStorage.getItem('goals')) || [];
    setGoals(storedGoals);
  }, []);

  useEffect(() => {
    // Save goals to localStorage whenever goals are updated
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGoalData({ ...goalData, [name]: value });
  };

  const handleGoalSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make a POST request to your backend to save the data
      const response = await fetch('http://localhost:5000/save_data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patient: {}, // Fill in with patient data if needed
          goal: goalData,
          emotion: {}, // Fill in with emotion data if needed
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result.message); // Log the success message from the server

        // Update the goals state if needed
        const updatedGoals = [...goals, goalData];
        setGoals(updatedGoals);
        setCurrentGoalIndex(updatedGoals.length);

        // Reset the goalData state for the next goal
        setGoalData({
          name: '',
          description: '',
          startDate: '',
          endDate: '',
        });

        console.log('Goals:', updatedGoals); // Log the updated goals
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error saving data:', error.message);
    }
  };

  const handleStatusChange = (newProgress, completed) => {
    setProgressData(newProgress);
    setIsCompleted(completed);
  };

  const handleDeleteGoal = () => {
    const updatedGoals = [...goals];
    updatedGoals.splice(currentGoalIndex, 1);
    setGoals(updatedGoals);
    setGoalData({
      name: '',
      description: '',
      startDate: '',
      endDate: '',
    });

    // Store updated goals in session storage or send to the backend to save in the database
    // Example: sendToBackend(updatedGoals);
  };

  const handleNextGoal = () => {
    if (currentGoalIndex < goals.length - 1) {
      setCurrentGoalIndex(currentGoalIndex + 1);
    }
  };

  const handlePrevGoal = () => {
    if (currentGoalIndex > 0) {
      setCurrentGoalIndex(currentGoalIndex - 1);
    }
  };

  return (
    <div>
      <div>
        <h1>Goal Tracker</h1>
        <form onSubmit={handleGoalSubmit}>
          <label>
            Name:
            <input type="text" name="name" value={goalData.name} onChange={handleInputChange} />
          </label>
          <label>
            Description:
            <input type="text" name="description" value={goalData.description} onChange={handleInputChange} />
          </label>
          <label>
            Start Date:
            <input type="date" name="startDate" value={goalData.startDate} onChange={handleInputChange} />
          </label>
          <label>
            End Date:
            <input type="date" name="endDate" value={goalData.endDate} onChange={handleInputChange} />
          </label>
          <button type="submit">Create Goal</button>
        </form>
      </div>

      <div>
        <Goal
          goalData={goals[currentGoalIndex] || {}}
          progressData={progressData}
          isCompleted={isCompleted}
          onStatusChange={handleStatusChange}
          onDeleteGoal={handleDeleteGoal}
        />
        <div>
          <button onClick={handlePrevGoal} disabled={currentGoalIndex === 0}>
            Previous Goal
          </button>
          <button onClick={handleNextGoal} disabled={currentGoalIndex === goals.length - 1}>
            Next Goal
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
