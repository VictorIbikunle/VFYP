# Server to receive images from frontend and run inference and return results
from fastapi import FastAPI, File, UploadFile

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI!"}

@app.post('/')
async def pr(blob: UploadFile = File(...)):
    file = await blob
    print(file)