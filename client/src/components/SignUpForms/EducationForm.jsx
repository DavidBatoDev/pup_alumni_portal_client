/* eslint-disable react/display-name */
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import './EducationForm.css';

const EducationForm = forwardRef(({
  nextStep,
  prevStep,
  formData,
  handleChange,
  handleLinkedInChange,
  handleEmploymentChange,
  handleEducationChange,
  addNewEmployment,
  addNewEducation,
  employmentHistory,
  educationHistory,
  handleDeleteEmployment,
  handleDeleteEducation
}, ref) => {
  const [error, setError] = useState('');
  const [fetchLinkedInSuccess, setFetchLinkedInSuccess] = useState(false);
  const [validation, setValidation] = useState({
    linkedin_profile: false,
  });

  const validateLinkedInProfile = () => {

    const linkedinRegex = /^https?:\/\/(www\.)?linkedin\.com\/in\/[A-Za-z0-9_-]+\/?$/;
    const cleanedLinkedIn = formData.linkedin_profile.trim();
    const isValid = linkedinRegex.test(cleanedLinkedIn);
    // console.log("LinkedIn URL:", cleanedLinkedIn, "isValid:", isValid);
    if (!cleanedLinkedIn || !isValid) {
      setValidation((prev) => ({ ...prev, linkedin_profile: false }));
      return false;
    }
    setValidation((prev) => ({ ...prev, linkedin_profile: true }));
    return true;
  };

  const handleLinkedInInputChange = (e) => {
    handleLinkedInChange(e);
    validateLinkedInProfile();
  };

  const validateFields = () => {
    const agreeInfo = document.getElementById('agreeInfo').checked;
    const privacyPolicy = document.getElementById('privacyPolicy').checked;

    if (!agreeInfo || !privacyPolicy) {
      setError('You must agree to the terms and privacy policy.');
      return false;
    }

    setError('');
    return true;
  };

  useImperativeHandle(ref, () => ({
    validateFields,
    validateLinkedInProfile,
    setFetchLinkedInSuccess
  }));

  return (
    <div className="edu-form-section w-auto">
      <h3 className="edu-form-section-title">EDUCATIONAL AND PROFESSIONAL INFORMATION</h3>

      {/* LinkedIn Profile Section */}
      <div className={`edu-form-group linkedin-input ${validation.linkedin_profile && fetchLinkedInSuccess ? "was-validated" : "is-invalid"}`}>
        <label>
          LinkedIn Profile (Optional) <span className="edu-form-important-txt">*</span>
        </label>
        <p className="edu-form-text-muted small">
          You can provide your LinkedIn profile link to automatically populate your educational and professional information. If not, please add them manually.
        </p>
        <div className="edu-form-input-group mb-3">
          <input
            type="text"
            name="linkedin_profile"
            placeholder="https://www.linkedin.com/in/[your-profile]"
            value={formData.linkedin_profile}
            onChange={handleLinkedInInputChange}
            onBlur={handleLinkedInInputChange}
            className="form-control"
          />
        </div>
        {!validation.linkedin_profile && (
          <div className="invalid-feedback">
            Please enter a valid LinkedIn profile URL.
          </div>
        )}
      </div>

      {/* Current Job and Employer Input (manual) */}
      <div className="d-flex flex-md-row flex-column justify-content-between gap-md-3">
        <div className="form-group w-100">
          <label>
            Current Job Title
          </label>
          <div className="input-group">
            <span className="input-group-text bg-white">
              <i className="fa-solid fa-briefcase" aria-hidden="true"></i>
            </span>
            <input
              type="text"
              name="current_job_title"
              placeholder="No Current Job Title"
              className="form-control"
              value={formData.current_job_title}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-group w-100">
          <label>
            Current Employer
          </label>
          <div className="input-group">
            <span className="input-group-text bg-white">
              <i className="fa-solid fa-user-tie" aria-hidden="true"></i>
            </span>
            <input
              type="text"
              name="current_employer"
              placeholder="No Employer"
              className="form-control"
              value={formData.current_employer}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Employment History Section */}
      <div className="edu-form-group">
        <h5>Employment History</h5>
        {employmentHistory && employmentHistory.length > 0 ? (
          employmentHistory.map((job, index) => (
            <div className="edu-form-employment-item" key={index}>
              <div className="edu-form-input-group gap-1">
                <div className="w-100">
                  <label>Job Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={job.job_title || ''}
                    onChange={(e) => handleEmploymentChange(index, 'job_title', e.target.value)}
                  />
                </div>

                <div className="w-100">
                  <label>Company</label>
                  <input
                    type="text"
                    className="form-control"
                    value={job.company || ''}
                    onChange={(e) => handleEmploymentChange(index, 'company', e.target.value)}
                  />
                </div>
              </div>

              <div className="edu-form-input-group">
                <div className="w-100">
                  <label>Description</label>
                  <textarea
                    className="form-control"
                    placeholder='Describe your job responsibilities, achievements, etc. (Optional)'
                    value={job.description || ''}
                    onChange={(e) => handleEmploymentChange(index, 'description', e.target.value)}
                  />
                </div>
              </div>

              <div className="edu-form-input-group gap-1">
                <div className="w-100">
                  <label>Start Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={job.start_date || ''}
                    onChange={(e) => handleEmploymentChange(index, 'start_date', e.target.value)}
                  />
                </div>

                <div className="w-100">
                  <label>End Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={job.end_date || ''}
                    onChange={(e) => handleEmploymentChange(index, 'end_date', e.target.value)}
                  />
                </div>
              </div>

              <div className="edu-form-input-group mt-2">
                <button
                  className="btn btn-sm btn-danger"
                  type="button"
                  onClick={() => handleDeleteEmployment(index)}
                >
                  <i className="fa fa-trash"></i> Delete Employment
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No employment history available.</p>
        )}
        <button className="btn btn-outline-primary btn-sm" type="button" onClick={addNewEmployment}>
          <i className="fa fa-plus"></i> Add New Employment
        </button>
      </div>

      {/* Education History Section */}
      <div className="edu-form-group">
        <h5>Education History</h5>
        {educationHistory && educationHistory.length > 0 ? (
          educationHistory.map((education, index) => (
            <div className="edu-form-education-item" key={index}>
              <div className="edu-form-input-group gap-1">
                <div className="w-100">
                  <label>Degree</label>
                  <input
                    type="text"
                    className="form-control"
                    value={education.degree || ''}
                    onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                  />
                </div>

                <div className="w-100">
                  <label>Institution</label>
                  <input
                    type="text"
                    className="form-control"
                    value={education.institution || ''}
                    onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                  />
                </div>
              </div>

              <div className="edu-form-input-group">
                <div className="w-100">
                  <label>Description</label>
                  <textarea
                    className="form-control"
                    value={education.description || ''}
                    onChange={(e) => handleEducationChange(index, 'description', e.target.value)}
                  />
                </div>
              </div>

              <div className="edu-form-input-group gap-1">
                <div className="w-100">
                  <label>Start Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={education.start_date || ''}
                    onChange={(e) => handleEducationChange(index, 'start_date', e.target.value)}
                  />
                </div>

                <div className="w-100">
                  <label>End Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={education.end_date || ''}
                    onChange={(e) => handleEducationChange(index, 'end_date', e.target.value)}
                  />
                </div>
              </div>

              <div className="edu-form-input-group mt-2">
                <button
                  className="btn btn-sm btn-danger"
                  type="button"
                  onClick={() => handleDeleteEducation(index)}
                >
                  <i className="fa fa-trash"></i> Delete Education
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No education history available.</p>
        )}
        <button className="btn btn-outline-primary btn-sm" type="button" onClick={addNewEducation}>
          <i className="fa fa-plus"></i> Add New Education
        </button>
      </div>

      {/* Submit Button */}
      <div className="d-flex justify-content-center edu-form-submit-box align-items-center">
        <div className="w-auto">
          <div className="edu-form-footer">
            <div className="edu-form-checkbox-section">
              <input type="checkbox" id="agreeInfo" required />
              <label htmlFor="agreeInfo">
                I hereby agree that the <a href="#">above information</a> is true and correct.
              </label>
            </div>
            <div className="edu-form-checkbox-section">
              <input type="checkbox" id="privacyPolicy" required />
              <label htmlFor="privacyPolicy">
                I’ve read and accept the <a href="#">Privacy Policy</a> *
              </label>
            </div>
          </div>
        </div>
        <div className="w-auto">
          <button className="btn btn-secondary" onClick={prevStep}>Back</button>
        </div>
        <div className="w-auto edu-form-submit">
          <button type="submit" className="btn btn-danger">
            Submit & Register
          </button>
        </div>
      </div>
      {error && <p className="edu-form-error-message text-center">{error}</p>}

    </div>
  );
});

export default EducationForm;
