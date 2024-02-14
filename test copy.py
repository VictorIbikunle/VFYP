import cv2
import numpy as np
from keras.models import model_from_json



#using a scale of 0-6 to predict the emotions
emotion_dict = {0: "Angry", 1: "Disgusted", 2: "Fearful", 3: "Happy", 4: "Neutral", 5: "Sad", 6: "Surprised"}

# Load the emotion detection model
json_file = open('model/emotion_model.json', 'r')
loaded_model_json = json_file.read()
json_file.close()
emotion_model = model_from_json(loaded_model_json)
emotion_model.load_weights("model/emotion_model.h5")
print("Loaded model from disk")

def inference(image_src):
    # Read image from path into opencv
    frame = cv2.imread(image_src)
    # if not ret:
    #     break

    # Resize the frame

    # Detect faces in the frame
    face_cascade = cv2.CascadeClassifier('haarcascades/haarcascades_frontalface_default.xml') #cropping the face images and storing them 
    gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray_frame, scaleFactor=1.3, minNeighbors=5)
    res = []
    print(faces)


    for (x, y, w, h) in faces:
        cv2.rectangle(frame, (x, y-50), (x+w, y+h+10), (0, 255, 0), 4)
        roi_gray_frame = gray_frame[y:y + h, x:x + w]
        cropped_img = np.expand_dims(np.expand_dims(cv2.resize(roi_gray_frame, (48, 48)), -1), 0)

        # Predict the emotion
        emotion_prediction = emotion_model.predict(cropped_img)
        maxindex = int(np.argmax(emotion_prediction))
        res.append({(x, y-50), (x+w, y+h+10), emotion_dict[maxindex]})
        cv2.putText(frame, emotion_dict[maxindex], (x+5, y-20), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 0, 0), 2, cv2.LINE_AA)

    return res 

print(inference("C:/Users/victo/Desktop/VFYP/messi.jpg"))





