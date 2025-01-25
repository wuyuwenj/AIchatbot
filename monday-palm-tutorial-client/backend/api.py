from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import palm  # import the palm.py file. We will create this file in the next step

app = FastAPI()

origins = ['*']  # Configure CORS to allow all origins (only for development purposes)

# Configure CORS to allow all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")  # just a simple endpoint to test if the API is working (we can say as a default endpoint)
async def read_root():
    return {"message": "Hello World"}


@app.post("/get_response")  # decorator to tell FastAPI which endpoint to call when we send a POST request to /get_response
def get_response(prompt: str, file_name: str):
    return palm.get_response(prompt, file_name)  # we will implement this function right after this


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)  # you may change the host and port numbers if you want, but don't forget to change them in the frontend as well.
