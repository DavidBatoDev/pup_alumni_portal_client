import React, { useState, useEffect } from 'react';
import './SpecificAnsweredSurvey.css';
import '../AnswerSurvey/AnswerSurvey.css';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import api from '../../api';
import { useNavigate } from 'react-router-dom';

const SpecificAnsweredSurvey = () => {
  const [surveyData, setSurveyData] = useState(null);
  const [currentSection, setCurrentSection] = useState(0);
  const { responseId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSurveyData = async () => {
      try {
        const surveyResponse = await api.get(`api/admin/response/${responseId}/details`);
        setSurveyData(surveyResponse.data.data);
      } catch (error) {
        console.error('Error fetching survey data:', error);
      }
    };

    fetchSurveyData();
  }, [responseId]);

  const handlePreviousSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleNextSection = () => {
    if (surveyData && currentSection < surveyData.sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const renderQuestion = (question) => {
    const { question_id, question_text, question_type, options, response, is_required } = question;

    if (question_type === 'Open-ended') {
      return (
        <textarea
          className="form-control"
          value={response?.response_text || ''}
          readOnly
        />
      );
    } else if (question_type === 'Multiple Choice' || question_type === 'Rating') {
      return (
        <div className="multiple-choice-options">
          {options.map((option) => (
            <div
              key={option.option_id}
              className={`option-item ${response?.selected_option?.option_id === option.option_id ? 'highlighted' : ''}`}
            >
              <input
                type="radio"
                name={`question-${question_id}`}
                value={option.option_id}
                checked={response?.selected_option?.option_id === option.option_id}
                readOnly
              />
              <label>{option.option_text}</label>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  if (!surveyData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="answer-survey-container">
      <div className="as-back-btn-container">
        <div onClick={() =>navigate(-1)} className="as-back-btn text-decoration-none">
          <i className="fas fa-chevron-left"></i>
          <span>Back</span>
        </div>
      </div>

      <div className="survey-info">
        <h2 className="survey-title">{surveyData.title}</h2>
        <p className="survey-description" dangerouslySetInnerHTML={{ __html: surveyData.description }} />
      </div>

      {surveyData.sections[currentSection] && (
        <div className="as-survey-section">
          <div className="as-survey-question-card">
            <h3 className="section-title">
              {surveyData.sections[currentSection].section_title}
            </h3>
            <p
              className="section-description"
              dangerouslySetInnerHTML={{ __html: surveyData.sections[currentSection].section_description }}
            />
          </div>

          {surveyData.sections[currentSection].questions.map((question) => (
            <div key={question.question_id} className="as-survey-question-card">
              <div className="as-question-header">
                <div className="as-question-title">
                  {question.question_text}
                  {question.is_required && <span className="question-required-asterisk">*</span>}
                </div>
              </div>
              <div className="as-question-content">
                {renderQuestion(question)}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="section-navigation">
        <button
          className="btn btn-secondary"
          onClick={handlePreviousSection}
          disabled={currentSection === 0}
        >
          Previous Section
        </button>

        <button
          className="btn btn-primary"
          onClick={handleNextSection}
          disabled={currentSection === surveyData.sections.length - 1}
        >
          Next Section
        </button>
      </div>
    </div>
  );
};

export default SpecificAnsweredSurvey;
