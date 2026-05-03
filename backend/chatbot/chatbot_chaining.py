""" IDEA :
        - 1. User Input: Destination
        - 2. User Input: Starting Location
        - 3. User Input: Days of Travel
        - 4. User Input: Mood of Travel
        - 5. User Input: Route Preference
        - 6. User Input: Summary of all the above inputs

    TODO:
        - 1. When User Enters Whats Asked , LLM will Verify the Input and ask for the next input,
        The Input is Stored and Passed onto the Sequential chain,
        - 2. The LLM will ask for the next input and so on
        - 3. Once all the inputs are collected, the LLM will summarize all the inputs and give a final output


    PROBLEM : 
            SLOW EXECUTION IF EVERYTHING IS RENDERED AT THE END
    SOLUTION : 
            EXECUTE THE PROMPT IN PARALLEL AND RETURN THE OUTPUT
            AS SOON AS THE INPUT IS COLLECTED

"""

from fastapi import FastAPI,Request
from fastapi.responses import JSONResponse
from langchain.prompts import ChatPromptTemplate
from .session_manager import SessionManager


# from langchain.chains import LLMChain
# from langchain.chains import SimpleSequentialChain
from .model import model
from .system_message import (
    destination_system_message,
    origin_system_message,
    days_system_message,
    mood_system_message,
    route_system_message,
    summary_system_message,
    chat_system_message
)



# END GOAL: Fill in state variables with user inputs
states = {
    "destination" : None,
    "origin" : None,
    "days" : None,
    "mood" : None,
    "route" : None,

}

# states = {
#     "destination" : "lahore",
#     "origin" : "quetta",
#     "days" : "3",
#     "mood" : "Historical",
#     "route" : "Car"

# }


system_message = []

LLM_QUOTA_MESSAGE = (
    "The AI planner is temporarily unavailable because the Gemini quota has been reached. "
    "Please try again after the retry window, or update the Gemini API quota/key on the server."
)


def is_quota_error(error):
    error_text = str(error).lower()
    return (
        "quota" in error_text
        or "resource_exhausted" in error_text
        or "429" in error_text
        or "retry_delay" in error_text
    )


def invoke_llm(prompt):
    try:
        return {"status": "success", "content": model.invoke(prompt).content}
    except Exception as e:
        if is_quota_error(e):
            print(f"LLM quota exhausted: {e}")
            return {"status": "quota_exceeded", "content": LLM_QUOTA_MESSAGE}

        print(f"LLM error: {e}")
        return {
            "status": "failure",
            "content": "The AI planner hit an error while generating a response. Please try again."
        }


""" VALIDATING USER_INPUTS """
""" IDEA: VALIDATE USER INPUTS USING LLM  """

## ASSUMING VALDATE GETS a non Formatted Prompt in this TEMPLATE:
## "" {user_input}  ""
def validate(prompt, user_input):
    """
    Validates user input against a prompt template.
    Extracts the parameter name from the prompt and formats it with the user input.
    """
    try:
        # Extract parameter name from the prompt string
        # Example: "Is {destination} a valid destination" -> "destination"
        param_name = prompt.split("{")[1].split("}")[0]
        
        # Format the prompt with the extracted parameter
        formatted_prompt = prompt.format(**{param_name: user_input})
        
        response = invoke_llm(formatted_prompt)
        if response["status"] == "quota_exceeded":
            return False, LLM_QUOTA_MESSAGE
        if response["status"] == "failure":
            return False, response["content"]
        
        response_content = response["content"].upper().strip()
        if "TRUE" in response_content:
            return True, "Input is valid."
        elif "FALSE" in response_content:
            return False, f"'{user_input}' doesn't seem valid. Please try again."
        else:
            # If the model didn't give a clear TRUE/FALSE, assume it's valid but log it
            print(f"Warning: Unclear validation response: {response_content}")
            return True, "Input accepted."
    except Exception as e:
        return False, f"Validation error: {str(e)}"



def get_destination(destination):
    """ Gets the Destination From the User """
    system_message.append(destination_system_message)
    destination_template = ChatPromptTemplate.from_messages(
        [
            ("system",system_message),
            ("human","Given the User Input: {destination}, Confirm the Destination and ask for the starting location")
        ]
    )

    validate_prompt = "Is {destination} a valid destination, ONLY RETURN TRUE OR FALSE STRICTLY "
    is_valid,message =  validate(validate_prompt,destination)  
    if is_valid:
        return {"status" : "success", "message":message,"template" : destination_template.format(destination=destination)}
    else:
        return {"status" : "failure", "message":message,"template" : None}

# response = validate("Is {user_input} a valid destination, ONLY RETURN TRUE OR FALSE STRICTLY","lahore")
# print(response)

def get_origin(origin):
    """ Gets the Start Location from the User """
    system_message.append(origin_system_message)
    origin_template = ChatPromptTemplate.from_messages(
        [
            ("system",system_message),
            ("human","Given the User Input: {origin}, Confirm the Start Location and ask for the days of travel")
        ]
    )
    validate_prompt = "Is {origin} a valid origin place,ONLY RETURN TRUE OR FALSE STRICTLY"
    is_valid,message =  validate(validate_prompt,origin)  
    if is_valid:
         return {"status" : "success", "message":message,"template" : origin_template.format(origin = origin)}
    else:
        return {"status" : "failure", "message":message,"template" : None}


def get_days_of_travel(days_of_travel):
    """ Takes in Responce of Initial_prompt_template Contemplates the Days of Travel """
    system_message.append(days_system_message)
    days_of_travel_template = ChatPromptTemplate.from_messages(
        [
            ("system",system_message),
            ("human","Given the User Input: {days_of_travel}, Confirm the Days of Travel and ask for the Mood of Travel")
        ]
    )

    validate_prompt = "Is {days_of_travel} valid days,ONLY RETURN TRUE OR FALSE STRICTLY"
    is_valid,message =  validate(validate_prompt,days_of_travel)  
    if is_valid:
        return {"status" : "success", "message":message,"template" : days_of_travel_template.format(days_of_travel= days_of_travel)}
    else:
        return {"status" : "failure", "message":message,"template" : None}



def get_mood(mood):
    """  Takes in Responce of Days_of_travel and Contemplates the Mood of Travel """
    system_message.append(mood_system_message)
    mood_template = ChatPromptTemplate.from_messages(
        [
            ("system",system_message),
            ("human","Given the User Input: {mood}, Confirm the Mood of Travel and ask for the Route Preference")
        ]
    )

    validate_prompt = "Is {mood} a valid mood,ONLY RETURN TRUE OR FALSE STRICTLY"
    is_valid,message =  validate(validate_prompt,mood)  
    if is_valid:
        return {"status" : "success", "message":message,"template" : mood_template.format(mood=mood)}
    else:
        return {"status" : "failure", "message":message,"template" : None}


def get_route(route):
    """ Takes in Responce of Mood and Contemplates the Route of Travel """
    system_message.append(route_system_message)
    route_template = ChatPromptTemplate.from_messages(
        [
            ("system",system_message),
            ("human", "Given the User Input: {route}, Confirm the Route Preference and let the user know that all information has been collected")
        ]
    )

    validate_prompt = "Is {route} a valid route,ONLY RETURN TRUE OR FALSE STRICTLY"
    is_valid,message =  validate(validate_prompt,route)  
    if is_valid:
        return {"status" : "success", "message":message,"template" : route_template.format(route=route)}
    else:
        return {"status" : "failure", "message":message,"template" : None}


## UPDATED THIS IN NEXT FUNCTION
# def get_summary(user_input):
#     """ Takes in all the User Inputs and Summarizes them into a single structured format """
#     system_message.append(summary_system_message)
#     summary_template = ChatPromptTemplate.from_messages(
#         [
#             ("system",system_message),
#             ("human","Given the User Input: {user_input}, Summarize the User Inputs into a structured format")
#         ]
#     )

#     # validate_prompt = "Is {user_input} a valid "
#     # is_valid,message =  validate(validate_prompt,user_input)  
#     # if is_valid:
#     #     return {"status" : "success", "message":message}
#     # else:
#     #     return {"status" : "failure", "message":message,"template" : summary_template.format(user_input = user_input)}



""" 
    CREATE A FUNCTION SUCH THAT IT COMBINES ALL THESE PROMPTS , 
    AFTER EACH PROMPT, IT VERIFIES THE INPUT AND THEN MOVES TO THE NEXT PROMPT
    AND AT THE END, IT GIVES A FINAL SUMMARY OF ALL THE INPUTS
"""

""" TODO:
        CREATE SIMPLE CHAIN AND GENERATE SUMMARY:

"""


def generate_summary(collected_states):
    """ 
    Gathers all user inputs, validates them, chains them, 
    and generates a comprehensive travel summary using only the LLM.
    """
    # Step 1: Validate input states
    for key, value in collected_states.items():
        if value is None:
            return {"status": "failure", "message": f"{key} is None", "returnType": None}

    destination = collected_states["destination"]
    origin = collected_states["origin"]
    days = collected_states["days"]
    mood = collected_states["mood"]
    route = collected_states["route"]

    # Step 2: Generate trip summary (LLM)
    summary_template = ChatPromptTemplate.from_messages([
        ("system", "You are a helpful travel assistant. Use the provided travel details to craft a rich, engaging summary."),
        ("human", f"""
        I am planning a trip with the following details:

        - Destination: {destination}
        - Origin: {origin}
        - Duration: {days} day(s)
        - Mood/Theme: {mood}
        - Preferred Route: {route}

        Please provide a vivid and informative travel summary including recommendations, tone suited to the mood, and travel tips if appropriate. 
        Structure the summary as: For Day 1 do this..., For Day 2 do this..., etc.
        """)
    ])
    try:
        prompt = summary_template.format(
            destination=destination,
            origin=origin,
            days=days,
            mood=mood,
            route=route
        )
        summary_result = invoke_llm(prompt)
        if summary_result["status"] != "success":
            return {
                "status": summary_result["status"],
                "message": summary_result["content"],
                "trip_summary": None
            }
        trip_summary = summary_result["content"]
    except Exception as e:
        return {
            "status": "failure",
            "message": f"Could not generate summary: {e}",
            "trip_summary": None
        }

    return {
        "status": "success",
        "message": "Trip summary generated successfully",
        "trip_summary": trip_summary
    }

def get_chat_response(input : str):
    """
        After ChatBot Generates A summary,
        Continue Chat for general questios/answers

        e.g. Why is Lahore Famous?
            Response : ......
    """

    response_template = ChatPromptTemplate.from_messages(
        [
            ("system",chat_system_message),
            ("human",f"This is my Question "
            "{input} I want you to Breifly answer it in simple , concise and friendly tone")
        ]
    )

    try:
        prompt = response_template.format(input = input)
        response = invoke_llm(prompt)
        if response["status"] != "success":
            return {"status" : response["status"],"message" :response["content"],"output" : None }
        return {"status" : "success","message" :"Response Generated Successfully","output" :response["content"] }

    
    except Exception as e:
        return {"status" : "failure","message" :f"Error {e} Occoured","output" : None }


# # THIS WORKS 
# response = generate_summary()
# if response["status"] == "success":
#     print(response["returnType"])
# else:
#     print("Error:", response["message"])


"""
    TODO:
        GET INTERMEDIATE LOCATIONS IF BY CAR
"""



"""
    TODO: EXTRACT SINGLE USER_INPUT TO PASS TO ASYNC CHAT FUNCTION
"""

def extract_input(user_input):
    pass
from fastapi.middleware.cors import CORSMiddleware
# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],  # In production, replace with your frontend URL
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

user_state = {
    "current_step" : "destination",
    "inputs" : {}
}


# current_step ={destination,origin,days,mood,route}

# @app.post("/chat")

session_manager=SessionManager()
async def chat(request : Request):
    # Get session ID from headers
    session_id = request.headers.get("X-Session-ID")
    data = await request.json()
    user_input = data.get("user_input") ## LOGIC IN REACT
    ## USER INPUT IS CURRENTLY I ASSUME 1 WORD ONLY , 
    ## ITS LOGIC WILL BE FURTHER EXECUTED IN REACT WHERE 
    ## USER_INPUT WILL BE STRIPPED TO 1 WORD ONLY
    # Create new session if none exists
    if not session_id or not session_manager.get_session(session_id):
        session_id = session_manager.create_session()
        return JSONResponse(content={
            "message": "Hello! I can help you plan your trip. Please tell me your destination.",
            "step": "destination",
            "session_id": session_id
        })
    
    # Get session data
    session = session_manager.get_session(session_id)
    step = session["current_step"]
    states = session["states"]
    system_message = session["system_message"]

   
   

    if step == "destination":
        response = get_destination(user_input)
        if response["status"] == "success":
            session["current_step"] = "origin"
            session["states"]["destination"] = user_input
            template = response["template"]
            llm_response = invoke_llm(template)
            return_json = llm_response["content"]
        else:
            return_json = f"Error: {response['message']} Please provide a valid destination."
            

    elif step == "origin":
        response = get_origin(user_input)
        if response["status"] == "success":
            session["current_step"] = "days"
            states["origin"] = user_input
            template = response["template"]
            llm_response = invoke_llm(template)
            return_json = llm_response["content"]
        else:
            return_json = f"Error: {response['message']} Please provide a valid origin."
    
    elif step == "days":
        response = get_days_of_travel(user_input)
        if response["status"] == "success":
            session["current_step"] = "mood"
            states["days"] = user_input
            template = response["template"]
            llm_response = invoke_llm(template)
            return_json = llm_response["content"]
        else:
            return_json = f"Error: {response['message']} Please provide a valid day."
    
    elif step == "mood":
        response = get_mood(user_input)
        if response["status"] == "success":
            session["current_step"] = "route"
            states["mood"] = user_input
            template = response["template"]
            llm_response = invoke_llm(template)
            return_json = llm_response["content"]
        else:
            return_json = f"Error: {response['message']} Please provide a valid mood."

    elif step == "route":
        response = get_route(user_input)
        if response["status"] == "success":
            states["route"] = user_input
            summary_response = generate_summary(states)
            if summary_response["status"] == "success":
                print("AFTER SUMMARY")
                session["current_step"] = "chat"
                return JSONResponse(content={
                    "message": summary_response["trip_summary"],
                    "step": session["current_step"],
                    "trip_summary": summary_response["trip_summary"],
                    "session_id": session_id
                })
            else:
                return JSONResponse(content={
                    "message": summary_response["message"],
                    "step": session["current_step"],
                    "session_id": session_id
                })
            
    elif step == "chat":
        response = get_chat_response(user_input)
        session["current_step"] = "chat" ## REMAIN IN CHAT 

        if response["status"] == "success":
            return_json = response.get("output", "No response generated.")
        else:
            return_json = response["message"]


            
    else:
        return_json = f"Error: {response['message']} Please provide a valid route."

    return JSONResponse(content={
        "message": return_json,
        "step": session["current_step"],
        "session_id": session_id
    })



from typing import Optional

# @app.post("/reset")
async def reset_conversation(request: Request):
    data = await request.json()
    session_id = data.get("session_id")
    
    # Create new session
    new_session_id = session_manager.create_session()
    
    return JSONResponse(content={
        "message": "Hello! I can help you plan your trip. Please tell me your destination.",
        "step": "destination",
        "session_id": new_session_id
    })



# from langchain.prompts import ChatPromptTemplate
# from langchain.schema.output_parser import StrOutputParser
# from langchain.schema.runnable import RunnableParallel ,RunnableLambda
# # from model import model

# from backend.messages.system_message import (
#     initial_system_message, 
#     confirmation_system_message, 
#     mood_system_message, 
#     route_system_message, 
#     summary_system_message
# )

# from langchain_google_genai import ChatGoogleGenerativeAI
# from dotenv import load_dotenv
# import os 

# load_dotenv()
# gemini_api_key = os.getenv("gemini_api_key")

# model = ChatGoogleGenerativeAI(
#     temperature=0,
#     model = "gemini-1.5-flash",
#     api_key= gemini_api_key
# )



# # USER INPUPTS: DESTINATION
# # OUTPUT:      TOURSIM GUIDE SUMMARY

# ## First Prompt , Inputting DESTINATION 

# system = []
# system.append(initial_system_message)
# human_input = []

# prompt_template = ChatPromptTemplate(
#     [
#         ("system",system)
#     ]
# )

# # def get_destination(user_input):
# #     """Gets the Destination from the User """

# #     destination_template = ChatPromptTemplate.from_messages(
# #         ("system",system),
# #         ("human","Given the User Input: {user_input}, Confirm the Destination and ask for the starting location")
# #     )

# #     return destination_template.format(user_input=user_input)



# system.append(confirmation_system_message)
# def get_start_location(user_input):
#     """ Gets the Start Location from the User """
#     destination_template = ChatPromptTemplate.from_messages(
#         [
#             ("system",system),
#             ("human","Given the User Input: {user_input}, Confirm the Start Location and ask for the days of travel")

#         ]
#     )

#     return destination_template.format(user_input=user_input)

# system.append(confirmation_system_message)

# def get_days_of_travel(user_input):
#     """ Takes in Responce of Initial_prompt_template Contemplates the Days of Travel """
#     days_of_travel = ChatPromptTemplate.from_messages(
#         [
#             ("system",system),
#             ("human","Given the User Input: {user_input}, Confirm the Days of Travel and ask for the Mood of Travel")
            
#         ]
#     )

#     return days_of_travel.format(user_input=user_input)

# system.append(mood_system_message)
# def get_mood(user_input):
#     """  Takes in Responce of Days_of_travel and Contemplates the Mood of Travel """

#     cons_prompt_template = ChatPromptTemplate.from_messages(
#         [
#             ("system",system),
#             ("human","Given the User Input: {user_input}, Confirm the Mood of Travel and ask for the Route Preference")
#         ]
#     )

#     return cons_prompt_template.format(user_input = user_input)

# system.append(route_system_message)
# def get_route(user_input):
#     route_template = ChatPromptTemplate.from_messages(
#         ("system"   ,system),
#         ("human"    ,"Given the User Input: {user_input}, Confirm the Route Preference")
#     )

#     return route_template.format(user_input = user_input)

# system.append(summary_system_message)
# def get_summary(user_input):
#     """ Takes in all the User Inputs and Summarizes them into a single structured format """

#     summary_template = ChatPromptTemplate.from_messages(
#         [
#             ("system",system),
#             ("human","Given the User Input: {user_input}, Summarize the User Inputs into a structured format")
#         ]
#     )

#     return summary_template.format(user_input = user_input)

# def get_combined_prompt(prompt):
#     """ Takes in all the Prompt and Combines it into a single Formatted Prompt """

#     formatted_prompt_template = ChatPromptTemplate.from_messages(
#         [
#             ("system","You Are a Prompt Formatter best in the World"),
#             ("human","Your Job is to Format the Prompt For better readibility For the End User : {prompt}")
#         ]
#     )

#     return formatted_prompt_template.format(prompt = prompt)


# ## Creating Chains Of all the Prompt_templates

# # destination_chain = (
# #     RunnableLambda(lambda x: get_destination(x["user_input"])) | model | StrOutputParser()
# # )

# start_location_chain = (
#     RunnableLambda(lambda x: get_start_location(x["user_input"])) | model | StrOutputParser()
# )

# travel_days_chain = (
#     RunnableLambda(lambda x: get_days_of_travel(x["user_input"]) | model | StrOutputParser())
# )

# mood_chain = (
#     RunnableLambda(lambda x: get_mood(x["user_input"]) | model | StrOutputParser())
# )

# route_chain = (
#     RunnableLambda(lambda x: get_route(x["user_input"])) | model | StrOutputParser()
# )
# summary_chain = (
#     RunnableLambda(lambda x: get_summary(x["user_input"])) | model | StrOutputParser()
# )
# combined_prompt_chain = (
#     RunnableLambda(lambda x: get_combined_prompt(x["prompt"])) | model | StrOutputParser()
# )

# state = {
#     "destination": None,
#     "origin": None,
#     "days": None,
#     "mood": None,
#     "route": None
# }

# step = 0

# ## Creating Main Chain And Running Parallely
# def journey_step_handler(user_input, step, state):
#     if step == 0:
#         state["destination"] = user_input
#         return get_start_location(user_input), step + 1, state
    
#     elif step == 1:
#         state["origin"] = user_input
#         return get_days_of_travel(user_input), step + 1, state
    
#     elif step == 2:
#         state["days"] = user_input
#         return get_mood(user_input), step + 1, state
    
#     elif step == 3:
#         state["mood"] = user_input
#         return get_route(user_input), step + 1, state
    
#     elif step == 4:
#         state["route"] = user_input
#         # Now generate summary using all collected info
#         combined_input = f"""
#         Destination: {state['destination']}
#         Origin: {state['origin']}
#         Days: {state['days']}
#         Mood: {state['mood']}
#         Route: {state['route']}
#         """
#         return get_summary(combined_input), step + 1, state
    
#     else:
#         return "You're all set! Would you like to ask anything else?", step, state



# # Initial state
# state = {}
# step = 0

# while True:
#     user_input = input("You: ")
#     bot_response, step, state = journey_step_handler(user_input, step, state)
#     print("Bot:", bot_response)
    
#     if step > 5:
#         break
