import "./signUpForms.css";

import React, { forwardRef, useImperativeHandle, useState } from 'react';

const PersonalInformationForm = forwardRef(({
  nextStep,
  formData,
  handleChange
}, ref) => {
  const [validation, setValidation] = useState({
    first_name: true,
    last_name: true,
    gender: true,
    date_of_birth: true,
    street: true,
    city: true,
    state: true,
    postal_code: true,
    country: true,
    graduation_year: true,
    major: true,
  });

  const validateGraduationYear = (year) => {
    const trimmedYear = year?.trim();
    // Check if it's a number and a valid year (e.g., between 1900 and current year)
    const currentYear = new Date().getFullYear();
    const isValidYear = /^[0-9]{4}$/.test(trimmedYear) && trimmedYear >= 1900 && trimmedYear <= currentYear;
    return isValidYear;
  };

  const validateFields = () => {
    const newValidation = {
      first_name: formData.first_name?.trim() !== '',
      last_name: formData.last_name?.trim() !== '',
      gender: formData.gender && formData.gender !== 'Select',
      date_of_birth: formData.date_of_birth?.trim() !== '',
      street: formData.street?.trim() !== '',
      city: formData.city?.trim() !== '',
      state: formData.state?.trim() !== '',
      postal_code: formData.postal_code?.trim() !== '',
      country: formData.country?.trim() !== '',
      graduation_year: validateGraduationYear(formData.graduation_year),
      major: formData.major?.trim() !== '',
    };

    setValidation(newValidation);

    // Return true if all fields are valid
    return Object.values(newValidation).every(value => value === true);
  };

  useImperativeHandle(ref, () => ({
    validateFields
  }));

  return (
    <div className="form-section">
      <h3 className="section-title">ALUMNI DETAILS</h3>
      <div className="form-group">
        <label>
          Name <span className="important-txt">*</span>
        </label>
        <div className="row g-1">
          <div className="col-lg-6 col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-white">
                <i className="fas fa-user"></i>
              </span>
              <input
                type="text"
                name="first_name"
                placeholder="First Name (e.g., Juan)"
                value={formData.first_name}
                onChange={handleChange}
                required
                className={`form-control ${validation.first_name ? '' : 'is-invalid'}`}
              />
              {!validation.first_name && (
                <div className="invalid-feedback">First name is required</div>
              )}
            </div>
          </div>
          <div className="col-lg-6 col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-white">
                <i className="fas fa-user"></i>
              </span>
              <input
                type="text"
                name="last_name"
                placeholder="Last Name (e.g., Doe)"
                value={formData.last_name}
                onChange={handleChange}
                required
                className={`form-control ${validation.last_name ? '' : 'is-invalid'}`}
              />
              {!validation.last_name && (
                <div className="invalid-feedback">Last name is required</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="form-group">
        <label>Gender</label>
        <div className="input-group">
          <span className="input-group-text bg-white">
            <i className="fa fa-user" aria-hidden="true"></i>
          </span>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className={`form-control ${validation.gender ? '' : 'is-invalid'}`}
          >
            <option>Select</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
          {!validation.gender && (
            <div className="invalid-feedback">Gender is required</div>
          )}
        </div>
      </div>
      <div className="form-group">
        <label>Date of Birth</label>
        <div className="input-group">
          <span className="input-group-text bg-white">
            <i className="fa fa-calendar" aria-hidden="true"></i>
          </span>
          <input
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
            className={`form-control ${validation.date_of_birth ? '' : 'is-invalid'}`}
          />
          {!validation.date_of_birth && (
            <div className="invalid-feedback">date_of_birth is required</div>
          )}
        </div>
      </div>
      <div className="form-group">
        <label>
          Address <span className="important-txt">*</span>
        </label>

        <div className="input-wrapper d-flex gap-2">
          <div className="input-group">
            <span className="input-group-text bg-white">
              <i className="fas fa-road"></i>
            </span>
            <input
              type="text"
              name="street"
              placeholder="Street (e.g., 123 Main St.)"
              value={formData.street}
              onChange={handleChange}
              required
              className={`form-control ${validation.street ? '' : 'is-invalid'}`}
            />
            {!validation.street && (
              <div className="invalid-feedback">Street is required</div>
            )}
          </div>

          <div className="input-group">
            <span className="input-group-text bg-white">
              <i className="fas fa-city"></i>
            </span>
            <input
              type="text"
              name="city"
              placeholder="City (e.g., Metro Manila)"
              value={formData.city}
              onChange={handleChange}
              required
              className={`form-control ${validation.city ? '' : 'is-invalid'}`}
            />
            {!validation.city && (
              <div className="invalid-feedback">City is required</div>
            )}
          </div>
        </div>


        <div className="input-wrapper d-flex gap-2">
          <div className="input-group">
            <span className="input-group-text bg-white">
              <i className="fas fa-signs-post"></i>
            </span>
            <input
              type="text"
              name="state"
              placeholder="State (e.g., Manila)"
              value={formData.state}
              onChange={handleChange}
              required
              className={`form-control ${validation.state ? '' : 'is-invalid'}`}
            />
            {!validation.state && (
              <div className="invalid-feedback">State is required</div>
            )}
          </div>

          <div className="input-group">
            <span className="input-group-text bg-white">
              <i className="fas fa-map-marked-alt"></i>
            </span>
            <input
              type="text"
              name="postal_code"
              placeholder="Postal Code (e.g., 4106)"
              value={formData.postal_code}
              onChange={handleChange}
              required
              className={`form-control ${validation.postal_code ? '' : 'is-invalid'}`}
            />
            {!validation.postal_code && (
              <div className="invalid-feedback">Postal Code is required</div>
            )}
          </div>

          <div className="input-group">
            <span className="input-group-text bg-white">
              <i className="fas fa-globe"></i>
            </span>
            <input
              type="text"
              name="country"
              placeholder="Country (e.g., Philippines)"
              value={formData.country}
              onChange={handleChange}
              required
              className={`form-control ${validation.country ? '' : 'is-invalid'}`}
            />
            {!validation.country && (
              <div className="invalid-feedback">Country is required</div>
            )}
          </div>
        </div>


      </div>
      <div className="form-group">
        <label>
          Scholastic Information <span className="important-txt">*</span>
        </label>

        <div className='input-wrapper d-flex gap-2'>
          <div className="input-group">
            <span className="input-group-text bg-white">
              <i className="fas fa-graduation-cap"></i>
            </span>
            <input
              type="text"
              name="graduation_year"
              placeholder="Graduation year (e.g., 2021)"
              value={formData.graduation_year}
              onChange={handleChange}
              required
              className={`form-control ${validation.graduation_year ? '' : 'is-invalid'}`}
            />
            {!validation.graduation_year && (
              <div className="invalid-feedback">Graduation year is required and must be a valid year</div>
            )}
          </div>

          <div className="input-group">
            <span className="input-group-text bg-white">
              <i className="fas fa-book-open"></i>
            </span>
            <input
              type="text"
              name="major"
              placeholder="major (e.g., MBA)"
              value={formData.major}
              onChange={handleChange}
              required
              className={`form-control ${validation.major ? '' : 'is-invalid'}`}
            />
            {!validation.major && (
              <div className="invalid-feedback">Major is required</div>
            )}
          </div>
        </div>

      </div>
      <div className="d-flex justify-content-end">
        <button className="btn btn-secondary" style={{ backgroundColor: "#a50000" }} onClick={nextStep}>Next</button>
      </div>
    </div>
  );
});

PersonalInformationForm.displayName = 'PersonalInformationForm';

export default PersonalInformationForm;
