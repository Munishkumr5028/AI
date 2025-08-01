import json
import pandas as pd
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import joblib

# ✅ Clean text function
def clean_text(text):
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    return text.strip()

# ✅ Load dataset
with open("qa_dataset.json", "r", encoding="utf-8") as f:
    data_json = json.load(f)

df = pd.DataFrame(data_json)
df["question"] = df["question"].apply(clean_text)

# ✅ Train TF-IDF Vectorizer
vectorizer = TfidfVectorizer(ngram_range=(1,2), stop_words="english")
X = vectorizer.fit_transform(df["question"])

# ✅ Save vectorizer, dataset, and X
joblib.dump((vectorizer, X, df), "frontend_ai_model.pkl")
print("✅ Model saved using similarity search.")

# ✅ Function to predict (for testing only)
def get_answer(query):
    query_vec = vectorizer.transform([clean_text(query)])
    similarity = cosine_similarity(query_vec, X).flatten()
    idx = similarity.argmax()
    return df["answer"].iloc[idx]

# ✅ Test Prediction
query = "how to center a button"
print("🤖 Bot:", get_answer(query))
