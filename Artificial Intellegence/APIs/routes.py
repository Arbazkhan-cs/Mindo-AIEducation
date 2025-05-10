# --- File: routes.py ---
from flask import Blueprint, request, jsonify
from http import HTTPStatus
from langchain_groq import ChatGroq
from langchain.prompts import ChatPromptTemplate
from dotenv import load_dotenv
import logging
from schemas import SubjectRequest, QuizRequest
from utils import clean_response, clean_quiz_response

load_dotenv()
logger = logging.getLogger(__name__)

syllabus_bp = Blueprint('syllabus', __name__)
quiz_bp = Blueprint('quiz', __name__)

llm = ChatGroq(model="llama3-8b-8192", temperature=0.5)

SYLLABUS_PROMPT = """
Task: Provide a detailed syllabus for the given subject in strict JSON format, adhering to these guidelines:
    -> Generate an extremely detailed and comprehensive syllabus covering ALL possible topics in the subject.
    -> The syllabus should be in JSON format and consist of the subject name, a very short description of the subject, and a list of topics.
    -> The description should be limited to one or two sentences, providing a concise overview of the subject.
    -> Avoid repeating topics or adding redundant information. Limit each topic to a single line.
    -> Ensure no additional text, explanations, or information outside the JSON structure.
Example:
{{
    "subject": "Software Engineering",
    "description": "The study of software development principles, methodologies, and life cycle models.",
    "syllabus": ["Introduction to software engineering", "Software crises", "Software Life Cycle Model", "Waterfall Model", "Prototype Model", "Spiral Model", "Agile Model", "Software Requirement Analysis and Specification"]
}}
Output: Provide only the JSON object as per the format above.
"""

syllabus_prompt_template = ChatPromptTemplate.from_messages([
    ("system", SYLLABUS_PROMPT),
    ("user", "Subject: {subject}")
])

syllabus_model = syllabus_prompt_template | llm

# Quiz Prompt
QUIZ_PROMPT = """
Generate {questionCount} multiple-choice questions on the topic "{topicName}".
Each question must have exactly 4 answer options, and only one correct option.
The output must be in this exact JSON format:
{{
  "topicName": "...",
  "questions": [
    {{
      "questionNumber": 1,
      "question": "...",
      "options": [
        {{"optionNumber": 1, "option": "..."}},
        {{"optionNumber": 2, "option": "..."}},
        {{"optionNumber": 3, "option": "..."}},
        {{"optionNumber": 4, "option": "..."}}
      ],
      "correctOption": 1
    }}
  ]
}}
Only return valid JSON. Do not include explanations or markdown.
"""

quiz_prompt_template = ChatPromptTemplate.from_messages([
    ("system", QUIZ_PROMPT),
    ("user", "Topic: {topicName}, Questions: {questionCount}")
])

quiz_model = quiz_prompt_template | llm


# --- Syllabus Route ---
def process_item(subject: str) -> dict:
    try:
        logger.info(f"Processing subject: {subject}")
        response = syllabus_model.invoke({"subject": subject})
        output = response.content
        return clean_response(output)
    except Exception as e:
        logger.error(f"Error generating syllabus for {subject}: {str(e)}")
        return {"error": f"Failed to process subject '{subject}'", "details": str(e)}

@syllabus_bp.route('/MindoSyllabusGenerator', methods=['POST'])
def generate_syllabus():
    try:
        data = request.get_json()
        if not isinstance(data, list):
            return jsonify({"error": "Request body must be a list of objects"}), HTTPStatus.BAD_REQUEST

        subjects = []
        for idx, item in enumerate(data):
            try:
                validated = SubjectRequest(**item)
                subjects.append(validated)
            except Exception as e:
                return jsonify({"error": f"Validation failed at index {idx}", "details": str(e)}), HTTPStatus.BAD_REQUEST

        responses = [process_item(s.subject) for s in subjects]
        return jsonify(responses), HTTPStatus.OK

    except Exception as e:
        logger.error(f"Unhandled error in syllabus: {str(e)}")
        return jsonify({"error": "Internal server error", "details": str(e)}), HTTPStatus.INTERNAL_SERVER_ERROR


# --- Quiz Route ---
@quiz_bp.route('/MindoQuizGenerator', methods=['POST'])
def generate_quiz():
    try:
        data = request.get_json()
        quiz = QuizRequest(**data)
        logger.info(f"Generating quiz for topic: {quiz.topicName}, count: {quiz.questionCount}")

        response = quiz_model.invoke({
            "topicName": quiz.topicName,
            "questionCount": quiz.questionCount
        })
        output = response.content
        return jsonify(clean_quiz_response(output)), HTTPStatus.OK

    except Exception as e:
        logger.error(f"Unhandled error in quiz: {str(e)}")
        return jsonify({"error": "Internal server error", "details": str(e)}), HTTPStatus.INTERNAL_SERVER_ERROR
