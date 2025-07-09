from flask import Flask, request, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

@app.route("/api/seo")
def seo_data():
    keyword = request.args.get("q")
    if not keyword:
        return jsonify({"error": "No keyword provided"}), 400

    def mock_data(k):
        return {
        "keyword": keyword,
        "volume": random.randint(1000, 100000),
        "cpc": round(random.uniform(0.1, 5.0), 2),
        "difficulty": random.randint(10, 90),
        "competition": round(random.uniform(0.1, 1.0), 2),
        "traffic": random.randint(100, 10000),
        "long_tail": "Yes" if len(keyword.split()) > 2 else "No",
        "trend": f"{random.randint(50, 100)}%",
        "competitors": random.randint(5, 50)
        }

    keywords = [keyword] + [f"{keyword} {i}" for i in range(1, 6)]
    return jsonify([mock_data(k) for k in keywords])

if __name__ == "__main__":
    app.run(port=5000)
