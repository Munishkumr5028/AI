from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import joblib
import re
from sklearn.metrics.pairwise import cosine_similarity

# ✅ Initialize FastAPI
app = FastAPI(title="Frontend UI Fix Bot", version="1.0")

# ✅ Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Load trained model (vectorizer, X, df)
vectorizer, X, df = joblib.load("frontend_ai_model.pkl")

# ✅ Text cleaning
def clean_text(text):
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    return text.strip()

# ✅ Function to find best answer
def get_answer(query):
    query_vec = vectorizer.transform([clean_text(query)])
    similarity = cosine_similarity(query_vec, X).flatten()
    idx = similarity.argmax()
    return df["answer"].iloc[idx]

# ✅ Request Schema
class QueryRequest(BaseModel):
    query: str

# ✅ Root Endpoint
@app.get("/")
def home():
    return {"message": "Frontend AI Bot API is running ✅"}

# ✅ Prediction Endpoint
@app.post("/predict")
def predict(data: QueryRequest):
    query = data.query
    if not query:
        return {"error": "No query provided"}
    
    answer = get_answer(query)
    return {"query": query, "answer": answer}
