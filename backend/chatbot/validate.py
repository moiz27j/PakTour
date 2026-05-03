# """ VALIDATING USER_INPUTS """
# """ IDEA: VALIDATE USER INPUTS USING LLM  """

# ## ASSUMING VALDATE GETS a non Formatted Prompt in this TEMPLATE:
# ## "" {user_input}  ""
# def validate(prompt,user_input,model):
#     formatted_prompt = prompt.format(user_input = user_input)

#     response = model.invoke(formatted_prompt)

#     if "valid" in response.lower() or "yes" in response.lower():
#         return True, "Input is valid."
#     else:
#         return False, "That doesn't seem like a valid input. Please try again.