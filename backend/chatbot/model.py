from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
import os 

load_dotenv()
gemini_api_key = os.getenv("gemini_api_key")

model = ChatGoogleGenerativeAI(
    temperature=0,
    model = "gemini-1.5-flash",
    api_key= gemini_api_key
)


