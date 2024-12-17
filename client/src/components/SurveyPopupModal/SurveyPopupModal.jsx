// src/components/SurveyPopupModal/SurveyPopupModal.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ModalContainer from "../ModalContainer/ModalContainer";
import CustomAlert from "../CustomAlert/CustomAlert"; // Uncomment if using CustomAlert
import SurveyCard from "../SurveyCards/SurveyCards";
import "./SurveyPopupModal.css";
import api from "../../api.js";
import { useSelector } from "react-redux";
import { Tooltip, Toast, Popover } from 'bootstrap'; // Import Bootstrap JS

const SurveyPopupModal = ({ closeModal }) => {
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

  // Separate states for modals
  const [showSurveyNotification, setShowSurveyNotification] = useState(true);
  const [showSurveyIntro, setShowSurveyIntro] = useState(true);

  // For survey intro form
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
          setShowSurveyNotification(false);
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

  // Handle checkbox change for survey intro
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

  // Handle survey intro submit
  const handleSurveyIntroSubmit = (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    const submissionData = {
      selectedOptions,
      otherOption: otherOption.trim(),
    };
    console.log("Survey Intro Submission:", submissionData);
    setShowSurveyIntro(false); // Close the intro modal
  };

  // Handle redirect for surveys
  // const handleSurveyRedirect = (surveyId) => {
  //   setShowSurveyNotification(false); // Close the notification modal
  //   navigate(`/survey/${surveyId}`);
  // };

  return (
    <>
      {/* Survey Notification Modal */}
      {showSurveyNotification && (
        <ModalContainer
          showModal={showSurveyNotification}
          closeModal={() => setShowSurveyNotification(false)} // Close notification modal
          title="Survey Notification"
        >
          {loading && <div>Loading...</div>}

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
                  closeModal={() => setShowSurveyNotification(false)} // Close notification modal
                />
              </div>
            </>
          )}

          {!loading && !error && surveys.length === 0 && (
            <p className="mx-auto">No new surveys available at the moment.</p>
          )}
        </ModalContainer>
      )}

      {/* Survey Intro Modal */}
      {showSurveyIntro && (
        <ModalContainer
          showModal={showSurveyIntro}
          closeModal={() => setShowSurveyIntro(false)} // Close intro modal
          title="Be a part of the PUP Graduate School Community!"
        >
          <div className="intro-header my-3 fs-4 fw-bold">
            As an Alumnus/Alumna of the PUP Graduate School, how would you like to be part of the university?
          </div>
          <div className="survey-intro-popup-content d-flex flex-column">
            <div className="intro-content-wrapper mt-4 gap-4 d-flex flex-column fs-6 mb-4 pb-4 border-bottom">
              <div className="intro-content-header">
                <span className="fw-bold">GET THE CHANCE TO BE PART OF THE GRADUATE SCHOOL</span> by participating in the tracer study on the “Development of Alumni Engagement Portal System for Tracer Studies”.
              </div>

              <div className="intro-content">
                As a sign of gratitude and appreciation for your support to the PUP Graduate School, for the first 100 alumni to respond to the survey, please accept the <span className="fw-bold">ONE HUNDRED PESO (P100.00) GCash after answering the short survey</span>. If you have any further inquiries about this survey, you may call the GS Office at 53351787 loc. 371 or 09457294287.
              </div>

              <div className="intro-end d-flex flex-column justify-content-end">
                <p className="mb-0">Best,</p>
                <p className="mb-0 fw-bold">DR. MARION A. CRESENCIO</p>
                <p className="mb-0">Associate Dean, PUP Graduate School</p>
              </div>
            </div>

            <p>I want to be: (please choose as many options as apply to your interest)</p>
            <form className="d-flex flex-column justify-content-center mx-4 mt-2 needs-validation" onSubmit={handleSurveyIntroSubmit}>
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

              {/* Submit button */}
              <div className="survey-submit-container my-4">
                <button
                  type="submit"
                  className="btn btn-secondary w-100"
                >
                  Submit
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
