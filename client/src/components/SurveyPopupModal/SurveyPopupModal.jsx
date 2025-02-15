// src/components/SurveyPopupModal/SurveyPopupModal.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ModalContainer from "../ModalContainer/ModalContainer";
import CustomAlert from "../CustomAlert/CustomAlert"; // Uncomment if using CustomAlert
import SurveyCard from "../SurveyCards/SurveyCards";
import "./SurveyPopupModal.css";
import api from "../../api.js";
import { useSelector } from "react-redux";
import { Tooltip, Toast, Popover } from 'bootstrap';
import CircularLoader from '../CircularLoader/CircularLoader';

const SurveyPopupModal = ({ closeModal, showQuickSurvey }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [validation, setValidation] = useState({
    selectedOptions: true,
    otherOption: true,
  })

  const { user, isAuthenticated } = useSelector((state) => state.user);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [surveys, setSurveys] = useState([]);

  // For quick survey form
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [otherOption, setOtherOption] = useState("");

  // List of options
  const options = [
    "A model and ambassador of the PUP Graduate School",
    "A special lecturer or professor",
    "A consultant",
    "A guest speaker",
    "A volunteer for extension and other community activities",
    "A contributor to financially support the graduate school extension activities",
    "A partner in research, innovation, and other networking events",
    "A graduate student for further graduate studies",
  ];

  // Fetch surveys
  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        if (!isAuthenticated) {
          return;
        }
        setLoading(true);
        const response = await api.get("/api/survey/unanswered-surveys");
        console.log("Unanswered Surveys: ", response.data.surveys);
        setSurveys(response.data?.surveys || []);
      } catch (error) {
        console.error("Error fetching surveys:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSurveys();
  }, [isAuthenticated]);

  // Initialize Bootstrap tooltips
  useEffect(() => {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new Tooltip(tooltipTriggerEl)
    });
  }, []);

  // Handle checkbox change for quick survey
  const handleCheckboxChange = (option) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  const validateFields = () => {
    const newValidation = {
      selectedOptions: selectedOptions.length > 0,
      otherOption: selectedOptions.includes("Others") ? otherOption.trim().length > 0 : true,
    }
    setValidation(newValidation);
    return Object.values(newValidation).every((val) => val);
  }

  const handleOtherInputChange = (e) => {
    setOtherOption(e.target.value);
  };

  // Handle quick survey submit
  const handleQuickSurveySubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    const submissionData = {
      selected_options: [...selectedOptions],
      other_response: otherOption.trim(),
    };


    try {
      setLoading(true);
      const response = await api.post("/api/quick-survey/submit", submissionData);

      if (response.status === 200 || response.status === 201) {
        // console.log("Quick survey submitted successfully:", response.data);
        // check if he already answer the survey
        const allUnansweredSuvey = await api.get("/api/survey/unanswered-surveys");
        console.log("Unanswered Surveys: ", allUnansweredSuvey.data.surveys);
        if (allUnansweredSuvey.data.surveys.find(survey => survey.survey_id === 1)) {
          navigate('/survey/1')
        }
      } else {
        // console.error("Quick survey submission failed:", response.data);
        setError(response.data);
      }
    } catch (error) {
      console.error("Error submitting quick survey:", error);
      setError(error);
    } finally {
      setLoading(false);
      closeModal();
    }
  };

  return (
    <>
      {/* Survey Notification Modal */}
      {!showQuickSurvey ? (
        <ModalContainer
          showModal={!showQuickSurvey}
          closeModal={closeModal} // Close notification modal
          title="Survey Notification"

        >
          {loading && <CircularLoader noOverlay={true} />}

          {/* Render error message if exists */}
          {error && (
            <CustomAlert
              severity="error"
              message={error.message || "An error occurred."}
              onClose={() => setError(null)}
            />
          )}

          {!loading && !error && surveys.length > 0 && (
            <>
              <div className="d-flex flex-column justify-content-center align-items-center my-4 gap-3">
                <div className="survey-popup-icon-container">
                  <i className="survey-popup-icon fa-regular fa-2xl fa-bell"></i>
                </div>
                <h4>
                  {surveys.length > 0
                    ? `You have ${surveys.length} surveys to complete!`
                    : "No new surveys available."}
                </h4>
              </div>
              <div className="survey-card-popup">
                <SurveyCard
                  surveys={surveys}
                  answered={false}
                  closeModal={closeModal} // Close notification modal
                />
              </div>
            </>
          )}

          {!loading && !error && surveys.length === 0 && (
            <p className="mx-auto">No new surveys available at the moment.</p>
          )}
        </ModalContainer>
      ) : (


        // Quick Survey Modal
        <ModalContainer
          showModal={showQuickSurvey}
          closeModal={closeModal} // Close quick survey modal
          title="Be a part of the PUP Graduate School Community!"
          hideHeader={true}
          mobileModal={true}
        >
          <div className="quick-survey-header my-3 fs-4 fw-bold">
            As an Alumnus/Alumna of the PUP Graduate School, how would you like to be part of the university?
          </div>
          <div className="quick-survey-popup-content d-flex flex-column">
            <p>I want to be: (please choose as many options as apply to your interest)</p>
            <form className="d-flex flex-column justify-content-center mx-4 mt-2 needs-validation" onSubmit={handleQuickSurveySubmit}>
              {/* Loop through options and display custom checkboxes */}
              {options.map((option, index) => (
                <label key={index} className="survey-container d-flex align-items-center">
                  {option}
                  <input
                    type="checkbox"
                    value={option}
                    checked={selectedOptions.includes(option)}
                    onChange={() => handleCheckboxChange(option)}
                  />
                  <span className="survey-checkmark"></span>
                </label>
              ))}

              {/* "Others" option */}
              <label className={`survey-container d-flex align-items-center gap-2 ${!validation.otherOption ? 'is-invalid' : ''}`}>
                Others:
                <input
                  type="checkbox"
                  checked={selectedOptions.includes("Others")}
                  onChange={() => handleCheckboxChange("Others")}
                />
                <span className="survey-checkmark"></span>
                <input
                  type="text"
                  value={otherOption}
                  onChange={handleOtherInputChange}
                  className={`survey-other-input ${!validation.otherOption ? 'is-invalid text-danger' : ''}`}
                  placeholder="Please Specify"
                  disabled={!selectedOptions.includes("Others")}
                />
              </label>
              {!validation.selectedOptions && (
                <div className="invalid-feedback d-block" data-bs-toggle="tooltip" title="Please check at least one option">Please check at least one option</div>
              )}
              {!validation.otherOption && (
                <div className="invalid-feedback d-block" data-bs-toggle="tooltip" title="Please specify the &quot;Others&quot; option">Please specify the &quot;Others&quot; option</div>
              )}

              <div className="quick-survey-content-wrapper mt-4 gap-4 d-flex flex-column fs-6">
                <div className="quick-survey-content-header">
                  <span className="fw-bold">GET THE CHANCE TO BE PART OF THE GRADUATE SCHOOL</span> by participating in the tracer study on the “Development of Alumni Engagement Portal System for Tracer Studies”.
                </div>

                <div className="quick-survey-content">
                  As a sign of gratitude and appreciation for your support to the PUP Graduate School, for the first 100 alumni to respond to the survey, please accept the <span className="fw-bold">ONE HUNDRED PESO (P100.00) GCash after answering the short survey</span>. If you have any further inquiries about this survey, you may call the GS Office at 53351787 loc. 371 or 09457294287.
                </div>

                <div className="quick-survey-end d-flex flex-column justify-content-end">
                  <p className="mb-0">Best,</p>
                  <p className="mb-0 fw-bold">DR. MARION A. CRESENCIO</p>
                  <p className="mb-0">Associate Dean, PUP Graduate School</p>
                </div>
              </div>

              {/* Submit button */}
              <div className="survey-submit-container my-5">
                <button
                  type="submit"
                  className="btn btn-secondary w-100 rounded-5"
                >
                  Go to Survey
                </button>
              </div>
            </form>
          </div>
        </ModalContainer>
      )}

    </>
  );
};

export default SurveyPopupModal;
