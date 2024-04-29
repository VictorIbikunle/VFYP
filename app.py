from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from flask import request, jsonify
from datetime import datetime
from flask_pymongo import PyMongo
import cv2
import numpy as np
from keras.models import model_from_json
import threading
from flask_socketio import SocketIO, emit
from bson import ObjectId  # Add this import
from flask import jsonify
from datetime import datetime


app = Flask(__name__)
CORS(app, supports_credentials=True)
app.config["MONGO_URI"] = "mongodb://localhost:27017/vfyp"
try:
    mongo = PyMongo(app)
    print("Connected to MongoDB")
except Exception as e:
    print("Error connecting to MongoDB:", e)

socketio = SocketIO(app, cors_allowed_origins="*")
collecting_mode = False

json_file = open('model/emotion_model.json', 'r')
loaded_model_json = json_file.read()
json_file.close()
emotion_model = model_from_json(loaded_model_json)
emotion_model.load_weights("model/emotion_model.h5")
print("Loaded model from disk")

emotion_dict = {0: "Angry", 1: "Disgusted", 2: "Fearful", 3: "Happy", 4: "Neutral", 5: "Sad", 6: "Surprised"}

is_model_running = False
model_thread = None

capture_frames = False
video_writer = None

called_model_emotions = []

# Define the patient schema
patient_schema = {
    "name": str,
    "dob": str,
    "phone_number": str,
    "patient_id": ObjectId  # Reference to the patient
}

# Create a patient collection
patient_collection = mongo.db.patients



# Define the goal schema
goals_schema = {
    "name": str,
    "description": str,
    "startDate": str,
    "endDate": str,
    "patient_id": ObjectId
}

goals_collection = mongo.db.goals

# Define the answer schema
answer_schema = {
    "question": str,  
    "answer": str  
}

answer_collection = mongo.db.answers

# Define the emotion graph schema
emotion_graph_schema = {
    "emotion": str,
    "timestamp": str,
    "patient_id": ObjectId  # Reference to the patient
}

# Create an emotion graph collection
emotion_graph_collection = mongo.db.emotion_graph

appointment_schema = {
    "patient_id": ObjectId,  
    "patient_name": str,
    "appointment_time": str,
    "appointment_date": str,
}

# Define the session schema
session_schema = {
    "patient_id": ObjectId,
    "start_time": datetime,
    "end_time": datetime,
    "data_references": list
}


appointment_collection = mongo.db.appointments

session_collection = mongo.db.sessions

report_collection = mongo.db.reports

reward_schema = {
    "name": str,  # Name of the reward
    "description": str  # Description of the reward
}

reward_collection = mongo.db.rewards




def emit_frame(frame):
    socketio.emit('frame', {'frame': frame})

def capture_frames_thread():
    global capture_frames, video_writer
    video_capture = cv2.VideoCapture(0, cv2.CAP_DSHOW)

    while capture_frames:
        success, frame = video_capture.read()
        if success:
            process_frame(frame)
            ret, jpeg = cv2.imencode('.jpg', frame)
            frame_bytes = jpeg.tobytes()
            emit_frame(frame_bytes)

            if video_writer:
                video_writer.write(frame)

    video_capture.release()
    if video_writer:
        video_writer.release()
    socketio.emit("stop_stream")

def process_frame(frame):
    gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    face_cascade = cv2.CascadeClassifier('haarcascades/haarcascades_frontalface_default.xml')
    faces = face_cascade.detectMultiScale(gray_frame, scaleFactor=1.3, minNeighbors=5)

    emotions = []

    for (x, y, w, h) in faces:
        roi_gray_frame = gray_frame[y:y + h, x:x + w]
        cropped_img = np.expand_dims(np.expand_dims(cv2.resize(roi_gray_frame, (48, 48)), -1), 0)

        emotion_prediction = emotion_model.predict(cropped_img)
        maxindex = int(np.argmax(emotion_prediction))
        emotions.append(emotion_dict[maxindex])

    log_collection = mongo.db.log
    for emotion in emotions:
        log_collection.insert_one({"emotion": emotion})
        called_model_emotions.append(emotion)

@app.route('/video_feed')
def video_feed():
    img_data = open("video_feed.jpg", "rb").read()
    response = make_response(img_data)
    response.headers['Content-Type'] = 'image/jpeg'
    return response

# Modify your '/save_data' route to handle patient, goal, and emotion graph data
@app.route('/save_data', methods=['POST'])
def save_data():
    try:
        data = request.get_json()
        print("Received data:", data)
        patient_data = data.get("patient")
        appointment_data = data.get("appointment")

        # Save patient data
        patient_id = patient_collection.insert_one(patient_data).inserted_id

        # Associate patient ID with appointment data
        appointment_data["patient_id"] = patient_id
        appointment_data["appointment_time"] = datetime.strptime(data["appointment"]["time"], "%H:%M").strftime("%H:%M")
        appointment_data["appointment_date"] = datetime.strptime(data["appointment"]["date"], "%Y-%m-%d").strftime("%Y-%m-%d")

        appointment_collection.insert_one(appointment_data)

        message = f"User selected: {patient_data['name']}"  # Create a message with the patient's name

        return jsonify({'message': 'Data added successfully', 'user_message': message})
    except Exception as e:
        print(f"Error in save_data endpoint: {str(e)}")
        return jsonify({'error': str(e)})





@app.route('/submit_report', methods=['POST'])
def submit_report():
    try:
        data = request.get_json()
        patient_name = data.get("patientName")
        notes = data.get("notes")
        reference = data.get("reference")

        # Save report data to MongoDB
        report_data = {
            "patientName": patient_name,
            "notes": notes,
            "reference": reference,
            "timestamp": datetime.utcnow()  # Add timestamp for record
        }
        report_id = report_collection.insert_one(report_data).inserted_id

        message = f"Report submitted successfully for {patient_name}."

        return jsonify({'message': message, 'reportId': str(report_id)})
    except Exception as e:
        return jsonify({'error': str(e)})




    
    # Define the endpoint to get all patients
@app.route('/get_all_patients', methods=['GET'])
def get_all_patients():
    try:
        patients = list(mongo.db.patients.find({}, {'_id': 1, 'name': 1, 'dob': 1, 'phoneNumber': 1}))  # Include additional patient details
        for patient in patients:
            patient['_id'] = str(patient['_id'])  # Convert ObjectId to string
        return jsonify({'patients': patients})
    except Exception as e:
        return jsonify({'error': str(e)})


@app.route('/get_patient/<patient_name>', methods=['GET'])
def get_patient_by_name(patient_name):
    try:
        # Access the "patients" collection
        patients_collection = mongo.db.patients

        # Retrieve the patient data using the patient name
        patient_data = patients_collection.find_one({"name": patient_name})

        # Exclude the MongoDB ObjectId from the response
        if patient_data:
            patient_data.pop('_id', None)

        # Return the patient data as JSON
        return jsonify({'patientData': patient_data})
    except Exception as e:
        return jsonify({'error': str(e)})
    


@app.route('/save_goal', methods=['POST'])
def save_goal():
    try:
        data = request.get_json()
        goal_data = data.get("goal")

        # Save goal data to MongoDB
        goal_id = goals_collection.insert_one(goal_data).inserted_id

        git
        if goal_data.get("progressData") == 100:
           
            reward_data = {
                "name": "Achievement Reward",
                "description": "Congratulations! You've achieved a goal."
            }
            reward_id = reward_collection.insert_one(reward_data).inserted_id

            goal_data["reward_id"] = reward_id
            goals_collection.update_one({"_id": goal_id}, {"$set": {"reward_id": reward_id}})

        message = f"Goal saved successfully with ID: {goal_id}"

        return jsonify({'message': message, 'goal_id': str(goal_id)})
    except Exception as e:
        return jsonify({'error': str(e)})



@app.route('/add_reward', methods=['POST'])
def add_reward():
    try:
        data = request.get_json()
        reward_data = {
            "name": data.get("name"),
            "description": data.get("description")
        }
        reward_id = reward_collection.insert_one(reward_data).inserted_id
        return jsonify({'message': 'Reward added successfully', 'reward_id': str(reward_id)})
    except Exception as e:
        return jsonify({'error': str(e)})




@app.route('/call_model', methods=['GET'])
def call_model():
    try:
        global capture_frames, video_writer, is_model_running, model_thread
        capture_frames = True

        if not is_model_running:
            model_thread = threading.Thread(target=capture_frames_thread)
            model_thread.start()
            is_model_running = True

        log_collection = mongo.db.log
        emotion_data = log_collection.find_one({}, {'_id': 0, 'emotion': 1})

        return jsonify({'message': 'Model calling started', 'emotionData': emotion_data})
    except Exception as e:
        return jsonify({'error': str(e)})

@app.route("/stop_model", methods=["GET"])
def stop_model():
    if request.method == "OPTIONS":
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        response.headers.add("Access-Control-Allow-Methods", "GET")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        return response
    elif request.method == "GET":
        global is_model_running, model_thread
        if is_model_running:
            print("Stopping the model thread")
            is_model_running = False
            model_thread.join()
            model_thread = None
            print("Model stopped successfully")
            return jsonify({"message": "Model stopped successfully"}), 200
        else:
            print("Model is not running")
            return jsonify({"message": "Model is not running"}), 400


@app.route('/collect_emotions', methods=['GET'])
def collect_emotions():
    global collecting_mode
    try:
        print("Collecting emotions from the model call...")
        emotionsList = ["Angry", "Disgusted", "Fearful", "Happy", "Neutral", "Sad", "Surprised"]
        log_collection = mongo.db.log

        # Get the count of each emotion
        result = log_collection.aggregate([
            {"$group": {"_id": "$emotion", "count": {"$sum": 1}}}
        ])

        # Print the count of each emotion
        print(list(result))

        # Filter out the count of each emotion in the list
        count_result = log_collection.aggregate([
            {"$group": {"_id": "$emotion", "count": {"$sum": 1}}}
        ])
        emotion_counts = {item["_id"]: item["count"] for item in count_result}

        # Create a list of dictionaries with emotion and count
        emotions_with_count = [{"emotion": emotion, "count": emotion_counts.get(emotion, 0)} for emotion in emotionsList]

        # Print the emotions with count
        print(emotions_with_count)

        collecting_mode = True

        # Emit the emotions directly to the frontend
        socketio.emit('emotion_data', {'emotionData': emotions_with_count})
        return jsonify({'message': 'Emotions collected successfully', 'emotionData': emotions_with_count})
    except Exception as e:
        return jsonify({'error': str(e)})



@app.route('/start_or_resume_session/<patient_id>', methods=['GET'])
def start_or_resume_session(patient_id):
    try:
        patient_id = ObjectId(patient_id)
        existing_session = session_collection.find_one({"patient_id": patient_id, "end_time": {"$exists": False}})
        
        if existing_session:
            # Resume the existing session
            session_data = existing_session
        else:
            # Start a new session
            session_data = {
                "patient_id": patient_id,
                "start_time": datetime.utcnow(),
                "data_references": []
            }
            session_collection.insert_one(session_data)
        
        return jsonify({"message": "Session started or resumed", "session_data": str(session_data)}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500



if __name__ == '__main__':
    socketio.run(app, debug=True)