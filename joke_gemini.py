import os
import google.generativeai as genai
from dotenv import load_dotenv

# ✅ Load API Key
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# ✅ Function to generate joke
def generate_joke(topic="programming"):
    prompt = f"Ek mazaakia joke likho {topic} aur AI ke upar, easy Hindi me."

    model = genai.GenerativeModel("gemini-1.5-flash")  # Free fast model
    response = model.generate_content(prompt)

    return response.text

# ✅ Run & Print Joke
print("🤣 AI ka Joke:")
print(generate_joke("programming"))
