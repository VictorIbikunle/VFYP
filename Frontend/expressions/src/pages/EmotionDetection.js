import React, { useRef, useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import Chart from "chart.js/auto";
import "./EmotionDetection.css";

function EmotionDetection() {
  const videoRef = useRef();
  const socket = useRef();
  const [modelCalling, setModelCalling] = useState(false);
  const chartRef = useRef(null);

  const updateChart = (emotionData) => {
    console.log("Emotion Data from Server:", emotionData);
    const data = chartRef.current.data.datasets[0].data.slice();  // Use a copy of the current data
  
    // Assuming the server responds with emotion data as an array of objects
    if (Array.isArray(emotionData)) {
      // Map over the array and update the data
      emotionData.forEach((item) => {
        const index = ["Angry", "Disgusted", "Fearful", "Happy", "Neutral", "Sad", "Surprised"].indexOf(item.emotion);
  
        if (index !== -1) {
          data[index] = item.count;
        }
      });
  
      chartRef.current.data.datasets[0].data = data;
      chartRef.current.update();
    } else {
      console.error("Invalid emotionData format. Expected an array.");
    }
  };

  useEffect(() => {
    socket.current = socketIOClient("http://127.0.0.1:5000");

    // Initialize Chart.js in the useEffect hook
    const ctx = document.getElementById("emotionChart");

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ["Angry", "Disgusted", "Fearful", "Happy", "Neutral", "Sad", "Surprised"],
        datasets: [{
          label: 'Emotion Counts',
          data: [0.0, 0.0, 0.0, 0.0, 0, 0, 0],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 99, 132, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(255, 99, 132, 1)',
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    socket.current.on("frame", (data) => {
      if (videoRef.current) {
        videoRef.current.src = `data:image/jpeg;base64,${data.frame}`;
      }
    });

    socket.current.on("stop_stream", () => {
      if (videoRef.current) {
        videoRef.current.src = "";
      }
    });

    socket.current.on("emotion_data", (data) => {
      updateChart(data.emotion);
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      socket.current.disconnect();
    };
  }, []);

  const callModel = async () => {
    setModelCalling(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/call_model", {
        method: "GET",
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'http://localhost:3000',
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Model Result:", result.message);

        if ('emotionData' in result) {
          console.log("Emotion Data:", result.emotionData);
          updateChart(result.emotionData);
        } else {
          console.error("Invalid response format. 'emotionData' not found.");
        }
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error calling model:", error);
    } finally {
      setModelCalling(false);
    }
  };

  const stopModel = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/stop_model", {
        method: "GET",
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'http://localhost:3000',
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Model Stopped:", result.message);
        setModelCalling(false);
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error stopping model:", error.message);
    }
  };

  const collectEmotions = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/collect_emotions", {
        method: "GET",
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'http://localhost:3000',
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Emotions Collected:", result.message);

        if ('emotionData' in result) {
          console.log("Emotion Data:", result.emotionData);
          updateChart(result.emotionData);
        } else {
          console.error("Invalid response format. 'emotionData' not found.");
        }
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error collecting emotions:", error.message);
    }
  };

  return (
    <div className="EmotionDetection">
      <p>Live Emotion Detection</p>
      <div className="video-container">
        <video ref={videoRef} autoPlay playsInline controls />
      </div>
      <canvas id="emotionChart" width="400" height="200"></canvas>
      <button onClick={callModel} disabled={modelCalling}>
        {modelCalling ? "Calling Model..." : "Call Model"}
      </button>
      <button onClick={stopModel}>
        Stop Model
      </button>
      <button onClick={collectEmotions}>
        Collect Emotions
      </button>
    </div>
  );
}

export default EmotionDetection;
