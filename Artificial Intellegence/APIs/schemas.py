from pydantic import BaseModel, Field
from typing import List

class SubjectRequest(BaseModel):
    subject: str = Field(..., min_length=1, description="The name of the subject")

class SubjectResponse(BaseModel):
    subject: str
    description: str
    syllabus: List[str]

class QuizOption(BaseModel):
    optionNumber: int
    option: str

class QuizQuestion(BaseModel):
    questionNumber: int
    question: str
    options: List[QuizOption]
    correctOption: int

class QuizRequest(BaseModel):
    topicName: str
    questionCount: int = Field(..., ge=1, le=10)

class QuizResponse(BaseModel):
    topicName: str
    questions: List[QuizQuestion]