import os
import google.generativeai as genai
from dotenv import load_dotenv

# ✅ Load API Key
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# ✅ Model Select
model = genai.GenerativeModel("gemini-1.5-flash")

# ✅ Conversation History
conversation = []

print("🤖 Gemini Chatbot Ready! (type 'exit' to quit)\n")

while True:
    user_input = input("👤 You: ")
    if user_input.lower() == "exit":
        print("👋 Goodbye!")
        break

    # ✅ Add user message to conversation
    conversation.append({"role": "user", "parts": [user_input]})

    # ✅ Generate response with context
    response = model.generate_content(conversation)

    # ✅ Extract response text
    bot_reply = response.text
    print("🤖 Gemini:", bot_reply, "\n")

    # ✅ Add bot response to conversation
    conversation.append({"role": "model", "parts": [bot_reply]})
