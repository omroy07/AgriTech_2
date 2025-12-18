from flask import Flask, request, jsonify, render_template
import google.generativeai as genai
import json, re
from flask_cors import CORS
from functools import wraps

app = Flask(__name__)
CORS(app)

API_KEY = "AIzaSyBSd4AesDhH2Nm3JgwPRFsjZm7g9CIpFUM"
genai.configure(api_key=API_KEY)
genai_model = genai.GenerativeModel('gemini-1.5-flash')

def sanitize_input(text, max_length=100):
    if not isinstance(text, str): return ""
    return re.sub(r'[<>"\']', '', text.strip())[:max_length]

def validate_required_fields(required_fields):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            json_data = request.get_json()
            if not json_data or "data" not in json_data:
                return jsonify({'error': 'Invalid input'}), 400
            for field in required_fields:
                if field not in json_data["data"] or not str(json_data["data"][field]).strip():
                    return jsonify({'error': f'Missing field: {field}'}), 400
            return f(*args, **kwargs)
        return decorated_function
    return decorator

def clean_ai_response(text_response):
    start, end = text_response.find("{"), text_response.rfind("}")
    return text_response[start:end+1] if start!=-1 and end!=-1 else text_response

@app.route('/')
def home():
    return render_template('cropplan.html')

@app.route('/predict', methods=['POST'])
@validate_required_fields(['season','soil_type','temperature','rainfall'])
def predict():
    user_data = {k: sanitize_input(str(v)) for k,v in request.json['data'].items()}
    conditions = ", ".join([f"{k}: {v}" for k,v in user_data.items()])
    prompt = f"""
    You are a JSON API for agriculture. Respond ONLY with JSON.
    Conditions: {conditions}.
    Return JSON with keys: predicted_crop, title, how_to_plant, fertilizer, timeline, ideal_rainfall, post_harvest.
    """
    try:
        response = genai_model.generate_content(prompt)
        cleaned = clean_ai_response(response.text)
        parsed = json.loads(cleaned)
        return jsonify({'crop': parsed.get('predicted_crop','Unknown'), 'guide_json_string': cleaned})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(port=5003, debug=True)
