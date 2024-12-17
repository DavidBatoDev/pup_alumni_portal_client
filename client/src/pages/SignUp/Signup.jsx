import React, { useState, useRef, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import MainFooter from "../../components/MainFooter/MainFooter";
import "./Signup.css";

import AccountDetailsForm from '../../components/SignUpForms/AccountDetailsForm';
import PersonalInformationForm from '../../components/SignUpForms/PersonalInformationForm';
import EducationForm from '../../components/SignUpForms/EducationForm';
import "../../global.css";
import axios from "axios";
import api from "../../api.js";
import { useNavigate } from "react-router-dom";
import BannerSmall from "../../components/Banner/BannerSmall";
import bannerImage from '../../assets/images/pup-login-banner.jpg';
import CircularLoader from "../../components/CircularLoader/CircularLoader";
import CustomAlert from '../../components/CustomAlert/CustomAlert';

const Signup = () => {
  // Manage state for the main registration form
  const [formData, setFormData] = useState({
    student_number: '',
    email: '',
    password: '',
    password_confirmation: '',
    first_name: '',
    last_name: '',
    gender: '',
    birthday: '',
    street: '',
    city: '',
    postal_code: '',
    country: '',
    state: '',
    linkedin_profile: '',
    graduation_year: '',
    degree: '',
    major: '',
    current_job_title: '',
    current_employer: '',
  });

  const [isAccountConfirmed, setIsAccountConfirmed] = useState(false);

  const [isEmailOrStudentNumberValid, setIsEmailOrStudentNumberValid] = useState(false);

  const emailOrStudentNumberIsValid = () => {
    setIsEmailOrStudentNumberValid(true);
  }

  const educationFormRef = useRef(); // Create a ref for the EducationForm

  // Step state to track the current form step
  const [currentStep, setCurrentStep] = useState(1);
  // const formContainerRef = useRef(null);

  // Separate states for employment and education history
  const [employmentHistory, setEmploymentHistory] = useState([]);
  const [educationHistory, setEducationHistory] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [linkedinError, setLinkedinError] = useState(null);

  const [verifiedAlumni, setVerifiedAlumni] = useState(false);


  const navigate = useNavigate();


  const changeDetails = (first_name, last_name, email, student_number, graduation_year, program) => {
    setFormData({
      ...formData,
      first_name: first_name,
      last_name: last_name,
      email: email,
      student_number: student_number,
      graduation_year: graduation_year,
      major: program
    });
  }

  // Handle modal confirmation (Still Continue)
  const handleModalConfirmation = () => {
    setIsAccountConfirmed(true);
  };

  useEffect(() => {
    // scrollToFormContainer();

    return () => {
      // Cleanup function
      setLoading(false);
      // setIsEmailOrStudentNumberValid(false);
    }
  }, [currentStep]);

  const nextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  // Handle form changes for main form data
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle changes for employment history table
  const handleEmploymentChange = (index, key, value) => {
    const updatedEmployment = [...employmentHistory];
    updatedEmployment[index][key] = value;
    setEmploymentHistory(updatedEmployment);
  };

  // Handle changes for education history table
  const handleEducationChange = (index, key, value) => {
    const updatedEducation = [...educationHistory];
    updatedEducation[index][key] = value;
    setEducationHistory(updatedEducation);
  };

  // Add new entry to employment history
  const addNewEmployment = () => {
    setEmploymentHistory([...employmentHistory, { company: '', job_title: '', start_date: '', end_date: '', description: '' }]);
  };

  // Add new entry to education history
  const addNewEducation = () => {
    setEducationHistory([...educationHistory, { institution: '', degree: '', field_of_study: '', start_date: '', end_date: '' }]);
  };

  const handleDeleteEmployment = (index) => {
    const updatedEmployment = employmentHistory.filter((_, i) => i !== index);
    setEmploymentHistory(updatedEmployment);
  };

  // Function to handle deletion of an education entry
  const handleDeleteEducation = (index) => {
    const updatedEducation = educationHistory.filter((_, i) => i !== index);
    setEducationHistory(updatedEducation);
  };

  const processLinkedInData = (data) => {
    const formattedEmploymentHistory = data.position
      .map((job) => ({
        company: job.companyName || '',
        job_title: job.title || '',
        start_date: job.start
          ? `${job.start.year}-${String(job.start.month + 1).padStart(2, '0')}-${String(job.start.day || 1).padStart(2, '0')}`
          : '',
        end_date: job.end && job.end.year !== 0
          ? `${job.end.year}-${String(job.end.month + 1).padStart(2, '0')}-${String(job.end.day || 1).padStart(2, '0')}`
          : '',
        description: job.description || '',
      }))
      .sort((a, b) => new Date(a.start_date) - new Date(b.start_date)); // Sort by start_date in ascending order

    const formattedEducationHistory = data.educations
      .map((education) => ({
        institution: education.schoolName || '',
        degree: education.degree || '',
        field_of_study: education.fieldOfStudy || '',
        start_date: education.start
          ? `${education.start.year}-${String(education.start.month + 1).padStart(2, '0')}-${String(education.start.day || 1).padStart(2, '0')}`
          : '',
        end_date: education.end && education.end.year !== 0
          ? `${education.end.year}-${String(education.end.month + 1).padStart(2, '0')}-${String(education.end.day || 1).padStart(2, '0')}`
          : '',
      }))
      .sort((a, b) => new Date(a.start_date) - new Date(b.start_date)); // Sort by start_date in ascending order

    // Set current_job_title and current_employer from latest job entry of employment history
    const latestEmployment = data.position.sort(
      (a, b) => new Date(a.start_date) - new Date(b.start_date)
    ).find((job) => (new Date(job?.end_date).getFullYear() !== null));

    if (latestEmployment) {
      setFormData({
        ...formData,
        current_job_title: latestEmployment.title || '',
        current_employer: latestEmployment.companyName || '',
      });
    }

    setEmploymentHistory([...employmentHistory, ...formattedEmploymentHistory]);
    setEducationHistory([...educationHistory, ...formattedEducationHistory]);
  };

  const fetchLinkedIn = async (url) => {
    if (!url) {
      setLinkedinError('LinkedIn profile URL is required');
      return;
    }

    setLoading(true);
    setLinkedinError(null);

    const options = {
      method: 'GET',
      url: 'https://linkedin-data-api.p.rapidapi.com/get-profile-data-by-url',
      params: {
        url: url
      },
      headers: {
        'x-rapidapi-key': '3c527754f3msh4f15cb231b6927bp144182jsn2f1487121bc8',
        'x-rapidapi-host': 'linkedin-data-api.p.rapidapi.com'
      }
    };

    try {
      setLoading(true);
      const response = await axios.request(options);
      if (response.data && response.status === 200 || response.status === 201) {
        processLinkedInData(response.data);
        educationFormRef.current.setFetchLinkedInSuccess(true);
      }

    } catch (error) {
      console.error('Failed to fetch LinkedIn data:', error);
      setLinkedinError('Failed to fetch LinkedIn data');
    } finally {
      setLoading(false);
    }

  };

  const validateLinkedInProfile = (url) => {
    const linkedinRegex = /^https?:\/\/(www\.)?linkedin\.com\/in\/[A-Za-z0-9_-]+\/?$/;
    const cleanedLinkedIn = url.trim();
    const isValid = linkedinRegex.test(cleanedLinkedIn);
    return cleanedLinkedIn !== '' && isValid;
  };

  // Handle LinkedIn profile input change and API request for fetching data
  const handleLinkedInChange = (e) => {
    educationFormRef.current.setFetchLinkedInSuccess(false);
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Call validateLinkedInProfile before proceeding
    const condition = validateLinkedInProfile(value);
    if (!condition) {
      educationFormRef.current.setValidation((prev) => ({ ...prev, linkedin_profile: false }));
      return;
    }
    educationFormRef.current.setValidation((prev) => ({ ...prev, linkedin_profile: true }));

    // Call fetchLinkedIn function to fetch data
    fetchLinkedIn(value);
  };

  // Handle main form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error before submit
    const isValid = educationFormRef.current.validateFields();
    if (!isValid) {
      setError('You must agree to the terms and privacy policy.');
      return; // If validation fails, stop the submission
    }


    if (formData.password !== formData.password_confirmation) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      // Submit main registration form data
      const response = await api.post('/api/register', formData);
      console.log('User Registered:', response.data);

      // Extract token
      const token = response.data.token;

      localStorage.setItem('token', token);

      // Function to submit a single employment history entry
      const submitEmploymentHistory = async (history) => {
        await api.post('/api/add-employment-history', history);
        console.log('Employment History Entry Added');
      };

      // Function to submit a single education history entry
      const submitEducationHistory = async (history) => {
        await api.post('/api/add-education-history', history);
        console.log('Education History Entry Added');
      };

      // Submit employment history entries one by one
      for (const history of employmentHistory) {
        await submitEmploymentHistory(history);
      }

      // Submit education history entries one by one
      for (const history of educationHistory) {
        await submitEducationHistory(history);
      }

      console.log('All employment and education history entries added successfully.');
      navigate('/login');
    } catch (error) {
      console.log('Error during submission:', error);
      setError(error.response?.data?.message || error.response?.data?.details[Object.keys(error.response?.data?.details)[0]] || 'Registration failed. Please try again');
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <Navbar />

      {linkedinError && <CustomAlert severity={"warning"} message={linkedinError} onClose={() => setLinkedinError(null)} />}

      {error && (
        <CustomAlert severity={"error"} message={error} onClose={() => setError(null)} />
      )}
      <div className="signup-page">
        {loading && <CircularLoader />}
        <div className="background login-background"></div>
        {/* Banner area */}
        <BannerSmall
          bannerTitle={"Register"}
          bannerImage={bannerImage}
        />

        {/* Signup Form */}
        {/* <div className="sign-up-glass-container glass" ref={formContainerRef}> */}
        <div className="sign-up-glass-container glass">
          {/* Header Section */}
          <div className="row justify-content-center">
            <div className="signup-header">
              <h1 className="signup-header">Join Our Alumni Network Today!</h1>
              <p className="signup-description">
                Become a part of our thriving alumni community. Register now to stay updated with the latest news,
                participate in events, access job listings, and connect with mentors.
              </p>
            </div>
          </div>

          {/* Signup Form Section */}
          <div className="row justify-content-center" style={{ marginTop: "100px" }}>
            <form onSubmit={handleSubmit} style={{ height: "100%" }} className="w-100" noValidate>
              {/* Form Container */}
              <div className="container d-flex justify-content-center">
                {/* Form Content based on Current Step */}
                <div className="forms-container">
                  {currentStep === 1 && (
                    <>
                      <AccountDetailsForm
                        nextStep={nextStep}
                        formData={formData}
                        handleChange={handleChange}
                        changeDetails={changeDetails}
                        setLoading={setLoading}
                        isEmailOrStudentNumberValid={isEmailOrStudentNumberValid}
                        emailOrStudentNumberIsValid={emailOrStudentNumberIsValid}
                        currentStep={currentStep}
                        setAccountConfirmed={setIsAccountConfirmed}
                      />

                      {/* Always show PersonalInformationForm after alumni verification */}
                      {(isAccountConfirmed || formData.email || verifiedAlumni) && (
                        <PersonalInformationForm
                          nextStep={nextStep}
                          prevStep={prevStep}
                          formData={formData}
                          handleChange={handleChange}
                        />
                      )}
                    </>
                  )}



                  {currentStep === 2 && (
                    <EducationForm
                      ref={educationFormRef}
                      nextStep={nextStep}
                      prevStep={prevStep}
                      formData={formData}
                      handleChange={handleChange}
                      handleLinkedInChange={handleLinkedInChange}
                      handleEmploymentChange={handleEmploymentChange}
                      handleEducationChange={handleEducationChange}
                      addNewEmployment={addNewEmployment}
                      addNewEducation={addNewEducation}
                      employmentHistory={employmentHistory}
                      educationHistory={educationHistory}
                      handleDeleteEmployment={handleDeleteEmployment}
                      handleDeleteEducation={handleDeleteEducation}
                    />
                  )}
                </div>
              </div>

            </form>
          </div>
        </div>

      </div>

      <MainFooter />
    </>
  );
};

export default Signup;
