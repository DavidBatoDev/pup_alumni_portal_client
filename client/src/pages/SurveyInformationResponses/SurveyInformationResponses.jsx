import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar';
import './SurveyInformationResponses.css';
import CircularLoader from '../../components/CircularLoader/CircularLoader';
import { useMediaQuery } from 'react-responsive';
import api from '../../api.js';

const SurveyInformationResponses = () => {
  const { surveyId } = useParams();
  const [survey, setSurvey] = useState(null);
  const [responses, setResponses] = useState([]);
  const [quickSurveyResponses, setQuickSurveyResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTable, setShowTable] = useState(true);
  const [allResponsesCard, setAllResponsesCard] = useState([]);

  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const navigate = useNavigate(); // To navigate programmatically

  useEffect(() => {
    const fetchSurveyData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');

        const surveyResponse = await api.get(`/api/admin/survey/${surveyId}`);
        setSurvey(surveyResponse.data);

        const responsesResponse = await api.get(`/api/admin/survey/${surveyId}/responses`);

        // Organize responses by alumni
        const organizedResponses = responsesResponse.data.data.sections.flatMap(section =>
          section.questions.flatMap(question =>
            question.responses.map(response => ({
              ...response,
              question_id: question.question_id,
              question_text: question.question_text,
            }))
          )
        );

        const organizedQuickSurveyResponses = responsesResponse.data.data.quick_survey_responses.map(response => {
          return {
            alumni_id: response.alumni_id,
            selected_options: response.selected_options.join(' ; '),
            other_response: response.other_response,
          };
        })
        setResponses(organizedResponses);
        setQuickSurveyResponses(organizedQuickSurveyResponses);
        console.log("organized responses", organizedResponses);

        const allResponsesResponse = await api.get(`/api/admin/survey/${surveyId}/all-responses`);
        setAllResponsesCard(allResponsesResponse.data.data);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching survey data:', error);
        setLoading(false);
      }
    };

    fetchSurveyData();
  }, [surveyId]);


  console.log("quickSurveyResponses", quickSurveyResponses);

  // Function to group responses by alumni
  const groupResponsesByAlumni = () => {
    const grouped = {};

    responses.forEach(response => {
      const alumniKey = `${response.alumni_id}_${response.alumni_email}`;

      if (!grouped[alumniKey]) {
        grouped[alumniKey] = {
          response_id: response.response_id,
          alumni_id: response.alumni_id, // Adding alumni_id for the link
          date_of_birth: response.date_of_birth,
          gender: response.gender,
          graduation_year: response.graduation_year,
          major: response.major,
          current_employer: response?.latest_employment?.company || 'N/A',
          job_title: response?.latest_employment?.job_title || 'N/A',
          start_date: response?.latest_employment?.start_date || 'N/A',
          end_date: response?.latest_employment?.end_date || 'N/A',
          response_date: new Date().toLocaleDateString(),
          answers: {},
        };
      }

      // find the quick survey response for the alumni
      const quickSurveyResponse = quickSurveyResponses.find(quickSurveyResponse => quickSurveyResponse.alumni_id === response.alumni_id);

      // store tje quick survey response for the alumni
      if (quickSurveyResponse) {
        grouped[alumniKey].answers['Quick-Survey'] = quickSurveyResponse.selected_options
        grouped[alumniKey].answers['Quick-Survey-Other'] = quickSurveyResponse.other_response || 'No Response';
      }

      // Store each question's answer for the alumni
      grouped[alumniKey].answers[response.question_id] = response.response_text || response.option_text || 'No Response';
    });

    

    return Object.values(grouped);
  };

  const exportAsCSV = () => {
    if (!survey || responses.length === 0) return;

    // Create headers
    const headers = ['#', 'Age', 'Gender', 'Graduation Year', 'Major', 'Response Date',];
    survey.sections.forEach(section => {
      section.questions.forEach(question => {
        if (question.question_text == "Your Gcash Number") {return}; // Skip phone number question for privacy
        headers.push(`"${question.question_text}"`); // Enclose question text in quotes
      });
    });

    // Create data rows
    const csvRows = groupResponsesByAlumni().map((alumni, index) => {
      const row = [
        `"${index + 1}"`,
        `"${calculateAge(alumni.date_of_birth)}"`,
        `"${alumni.gender}"`,
        `"${alumni.graduation_year}"`,
        `"${alumni.major}"`,
        `"${alumni.response_date}"`,
        `"${alumni.current_employer}"`,
        `"${alumni.job_title}"`,
        `"${alumni.start_date}"`,
        `"${alumni.end_date}"`,
      ];

      // Add responses for each question
      survey.sections.forEach(section => {
        section.questions.forEach(question => {
          if (question.question_text == "Your Gcash Number") {return}
          row.push(`"${alumni.answers[question.question_id] || 'No Response'}"`); // Enclose responses in quotes
        });
      });

      return row;
    });

    // Combine headers and rows into CSV content
    const csvContent = [
      headers.join(','), // Join headers with commas
      ...csvRows.map(row => row.join(',')) // Join each row with commas
    ].join('\n'); // Separate rows with newline characters

    // Export the CSV file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${survey.survey}_${surveyId}.csv`; // Set download file name
    a.click();
    URL.revokeObjectURL(url);
  };

  const calculateAge = (date_of_birth) => {
    if (!date_of_birth) return null
    var today = new Date();
    var birthDate = new Date(date_of_birth);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }


  const toggleTableVisibility = () => {
    setShowTable(prev => !prev);
  };

  // Navigate to the specific alumni response page
  const handleCardClick = (responseId) => {
    navigate(`/admin/survey/response/${responseId}`);
  };

  return (
    <div className={`survey-info-responses-container ${isMobile ? 'mobile' : ''}`}>
      <AdminSidebar />

      {loading ? <CircularLoader /> : (
        <div className={`survey-info-content ${isMobile ? 'mobile-content' : ''}`}>
          <h1 className="survey-info-title">{survey?.survey}</h1>
          <p className="survey-info-description" dangerouslySetInnerHTML={{__html: survey?.description}}/>
          <div className={`survey-info-dates ${isMobile ? 'mobile-dates' : ''}`}>
            <span>Start Date: {new Date(survey?.start_date).toLocaleDateString()}</span>
            <span>End Date: {new Date(survey?.end_date).toLocaleDateString()}</span>
          </div>

          {/* Survey Responses Toggle */}
          <div className='d-flex flex-column justify-content-between '>
            <h2 className='survey-info-subtitle'>Survey Responses</h2>
            <div className="d-flex gap-2 mb-3">
              <button className="btn btn-secondary" onClick={toggleTableVisibility}>
                {showTable ? 'Show Card View' : 'Show Table'}
              </button>
              <button className="btn export-as-csv-btn" onClick={exportAsCSV}>Export as CSV</button>
            </div>
          </div>

          {/* Conditional Rendering for Table or Card View */}
          {showTable ? (
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="thead-light">
                  <tr>
                    <th>#</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Graduation Year</th>
                    <th>Major</th>
                    <th>Response Date</th>
                    <th>Current Employer</th>
                    <th>Job Title</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Quick Survey Response</th>
                    <th>Quick Survey Other</th>
                    {survey.sections.flatMap(section =>
                      section.questions.map(question => (
                        <th key={question.question_id}>{question.question_text}</th>
                      ))
                    )}
                  </tr>
                </thead>
                <tbody>
                  {groupResponsesByAlumni().map((alumni, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{calculateAge(alumni.date_of_birth)}</td>
                      <td>{alumni.gender}</td>
                      <td>{alumni.graduation_year}</td>
                      <td>{alumni.major}</td>
                      <td>{alumni.response_date}</td>
                      <td>{alumni.current_employer}</td>
                      <td>{alumni.job_title}</td>
                      <td>{alumni.start_date}</td>
                      <td>{alumni.end_date}</td>
                      <td>{alumni.answers['Quick-Survey']}</td>
                      <td>{alumni.answers['Quick-Survey-Other']}</td>
                      {survey.sections.flatMap(section =>
                        section.questions.map(question => (
                          <td key={question.question_id}>{alumni.answers[question.question_id] || 'No Response'}</td>
                        ))
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="card-view">
              <div className='card-view--container'>
                {allResponsesCard.map((response, index) => (
                  <div key={index} className="response--card" onClick={() => handleCardClick(response.response_id)}>
                    <h4>{response.alumni.alumni_name} [{response.alumni.alumni_id}]</h4>
                    <p>{response.alumni.alumni_email}</p>
                    <p>{response.alumni.response_date}</p>
                    <p>{index + 1}</p>
                  </div>
                ))}

              </div>
            </div>
          )}
          <h4 className='mt-5'>Survey Details: </h4>
          {/* Survey Sections and Questions */}
          {survey.sections.map(section => (
            <div key={section.section_id}>
              <h2 className="survey-info-subtitle">{section.section_title}</h2>
              <p dangerouslySetInnerHTML={{__html: section.section_description}}/>
              {section.questions.map(question => (
                <div key={question.question_id} className={`survey-question ${isMobile ? 'mobile-question' : ''}`}>
                  <h5>{question.question_text} <strong>{question.is_required ? '*' : ''} </strong></h5>
                  {(question.question_type === 'Multiple Choice' || question.question_type === 'Rating' || question.question_type === 'Dropdown') && (
                    <ul>
                      {question.options.map(option => (
                        <li key={option.option_id}>{option.option_text} - {option.option_value}</li>
                      ))}
                    </ul>
                  )}
                  {question.question_type === 'Open-ended' && <p>(Open-ended response)</p>}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SurveyInformationResponses;
