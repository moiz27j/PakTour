from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from chatbot.chatbot_chaining import chat,reset_conversation


app = FastAPI()

# Middleware for CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Data-provider routes are disabled while the chatbot is running LLM-only.
# This also prevents Mongo/Redis/Places/flight startup failures from taking down /chat.

## CHATBOT_CHAINING ROUTERS
app.add_api_route("/chat",endpoint=chat,methods=["POST"])
app.add_api_route("/reset",endpoint=reset_conversation,methods=["POST"])

if __name__ == "__main__":
    uvicorn.run(app,host = "0.0.0.0",port = 8000)
