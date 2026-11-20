import mongoose from 'mongoose';

const optionSchema = new mongoose.Schema({
  textTamil: { type: String, required: true },
  textEnglish: { type: String, default: '' },
  isCorrect: { type: Boolean, required: true, default: false }
});

const educationQuizSchema = new mongoose.Schema({
  questionTamil: { type: String, required: true },
  questionEnglish: { type: String, default: '' },
  subject: {
    type: String,
    enum: ['General Tamil', 'General Studies', 'Aptitude & Mental Ability', 'Current Affairs', 'General Science'],
    default: 'General Studies'
  },
  examCategory: {
    type: String,
    enum: ['TNPSC Group 4 / VAO', 'TNPSC Group 2', 'TN Police Constable', 'SSC / RRB', 'General Knowledge'],
    default: 'TNPSC Group 4 / VAO'
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  options: [optionSchema],
  explanationTamil: { type: String, default: '' },
  explanationEnglish: { type: String, default: '' },
  quizDate: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

const EducationQuiz = mongoose.model('EducationQuiz', educationQuizSchema);
export default EducationQuiz;
