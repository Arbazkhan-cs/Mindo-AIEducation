# --- File: app.py ---
from flask import Flask
from routes import syllabus_bp, quiz_bp
import logging

app = Flask(__name__)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# Register blueprints
app.register_blueprint(syllabus_bp)
app.register_blueprint(quiz_bp)

@app.route('/', methods=['GET'])
def home():
    return {
        "message": "Welcome to Sway Syllabus Generator & Quiz API",
        "version": "2.0",
        "endpoints": {
            "/MindoSyllabusGenerator": {
                "method": "POST",
                "description": "Generate syllabus for multiple subjects"
            },
            "/MindoQuizGenerator": {
                "method": "POST",
                "description": "Generate multiple-choice quiz questions from a topic"
            }
        }
    }

@app.errorhandler(Exception)
def handle_error(error):
    return {"error": "Internal server error", "details": str(error)}, 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=7860, threaded=True)
