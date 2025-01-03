import React, { useState, useEffect } from 'react';
// import axios from 'axios';
import api from '../../api';
import CustomAlert from '../../components/CustomAlert/CustomAlert';
import './Profile.css';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../store/UserSlice.js';
import CircularLoader from '../../components/CircularLoader/CircularLoader.jsx';

const ProfileSettings = () => {
  // const { profile, address, employmentHistory, educationHistory } = useOutletContext();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.user);
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    current_job_title: '',
    current_employer: '',
  });
  const [personalInfo, setPersonalInfo] = useState({
    date_of_birth: '',
    linkedin_profile: '',
  });
  
  const [deleteProfilePicture, setDeleteProfilePicture] = useState(false);
  const [profilePicture, setProfilePicture] = useState('');
  const [address, setAddress] = useState({});
  const [employmentHistory, setEmploymentHistory] = useState([]);
  const [educationHistory, setEducationHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Create local state for employment and education history to handle editing
  const [editableAddress, setEditableAddress] = useState({ ...address });
  const [editableEmploymentHistory, setEditableEmploymentHistory] = useState([...employmentHistory]);
  const [editableEducationHistory, setEditableEducationHistory] = useState([...educationHistory]);

  // State to keep track of which rows are currently being edited
  const [editingAddressId, setEditingAddressId] = useState(""); // Pending for change in backend to use address_id
  const [editingEmploymentId, setEditingEmploymentId] = useState("");
  const [editingEducationId, setEditingEducationId] = useState("");

  const [alert, setAlert] = useState({
    severity: '',
    message: '',
  });

  useEffect(() => {
    api
      .get(`/api/profile`)
      .then((response) => {
        if (response.data.success) {
          setProfile({
            first_name: response.data.data.first_name,
            last_name: response.data.data.last_name,
            email: response.data.data.email,
            phone: response.data.data.phone || '',
            current_job_title: response.data.data.current_job_title,
            current_employer: response.data.data.current_employer,
          })
          setPersonalInfo({
            date_of_birth: response.data.data.date_of_birth,
            linkedin_profile: response.data.data.linkedin_profile,
          });
          setProfilePicture(response.data.data.profile_picture);
          setEditableAddress(response.data.data.address);
          setEditableEmploymentHistory(response.data.data.employment_history || []);
          setEditableEducationHistory(response.data.data.education_history || []);
          setDeleteProfilePicture(false);
        }
      })
      .catch((error) => {
        console.error('Error fetching profile data:', error);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleCloseAlert = () => {
    setAlert({
      severity: '',
      message: '',
    });
  };

  const handleUpdateProfile = async (e) => {
      e.preventDefault();
      const body = new FormData();
      body.append('first_name', profile.first_name);
      body.append('last_name', profile.last_name);
      body.append('phone', profile.phone);

      if (deleteProfilePicture) {
          body.append('delete_profile_picture', true); 
      }

      if (profile.profile_picture && profile.profile_picture instanceof File) {
          body.append('profile_picture', profile.profile_picture);
          setUploading(true);
      }

      api
          .post('/api/update-profile', body, {
              headers: {
                  'Content-Type': 'multipart/form-data',
              },
          })
          .then((response) => {
              if (response.data.success) {
                  console.log('Profile updated successfully:', response.data.data);
                  setAlert({
                      severity: 'success',
                      message: 'Profile updated successfully',
                  });
                  setProfile({
                      first_name: response.data.data.first_name,
                      last_name: response.data.data.last_name,
                      email: response.data.data.email,
                      phone: response.data.data.phone,
                  });
                  setProfilePicture(
                      `${import.meta.env.VITE_BACKEND_URL}/storage/${response.data.data.profile_picture || 'profile_pictures/default-profile.jpg'}`
                  );
                  dispatch(updateUser({ user: {profile_picture: "profile_pictures/default-profile.jpg" ,...response.data.data }}));
                  setUploadSuccess(true);
              }
          })
          .catch((error) => {
              console.error('Error updating profile:', error);
              setAlert({
                  severity: 'error',
                  message: 'Error updating profile. Try again later.',
              });
          })
          .finally(() => {
              setUploading(false);
              setTimeout(() => {
                  handleCloseAlert();
              }, 5000);
          });
  };

  const handleUpdatePersonalInfo = () => {
    api
      .post('/api/update-profile', personalInfo)
      .then((response) => {
        if (response.data.success) {
          console.log('Personal info updated successfully:', response.data.data);
          setAlert({
            severity: 'success',
            message: 'Personal info updated successfully',
          });
          setPersonalInfo({
            date_of_birth: response.data.data.date_of_birth,
            linkedin_profile: response.data.data.linkedin_profile,
          });
        }
      })
      .catch((error) => {
        console.error('Error updating personal info:', error);
        setAlert({
          severity: 'error',
          message: 'Error updating personal info',
        });
      }).finally(() => {
        setTimeout(() => {
          handleCloseAlert();
        }, 5000);
      })
  }

  const handleUpdateCurrentEmployment = () => {
    const profileUpdate = {
      current_job_title: profile.current_job_title,
      current_employer: profile.current_employer,
    };

    api
      .post('/api/update-profile', profileUpdate)
      .then((response) => {
        if (response.data.success) {
          console.log('Profile updated successfully:', response.data.data);
          setAlert({
            severity: 'success',
            message: 'Profile updated successfully',
          });
          setProfile({
            current_job_title: response.data.data.current_job_title,
            current_employer: response.data.data.current_employer,
          });
        }
      })
      .catch((error) => {
        console.error('Error updating profile:', error);
        setAlert({
          severity: 'error',
          message: 'Error updating profile',
        });
      })
      .finally(() => {
        setTimeout(() => {
          handleCloseAlert();
        }, 5000);
      })
  }

  const handlePhotoChange = (e) => {
    const linkForFile = URL.createObjectURL(e.target.files[0]);
    setProfilePicture(linkForFile);
    setProfile({
      ...profile,
      profile_picture: e.target.files[0],
    });
  }

  // Handle changes for address fields
  const handleAddressChange = (id, field, value) => {
    const updatedAdddress = editableAddress.map((address) =>
      address.address_id === id ? { ...address, [field]: value } : address
    )
    setEditableAddress(updatedAdddress);
  };

  // Handle changes for employment history fields
  const handleEmploymentChange = (id, field, value) => {
    const updatedHistory = editableEmploymentHistory.map((job) =>
      job.employment_id === id ? { ...job, [field]: value } : job
    );
    setEditableEmploymentHistory(updatedHistory);
  };

  // Handle changes for education history fields
  const handleEducationChange = (id, field, value) => {
    const updatedEducation = editableEducationHistory.map((edu) =>
      edu.education_id === id ? { ...edu, [field]: value } : edu
    );
    setEditableEducationHistory(updatedEducation);
  };

  const handleChangeProfile = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    })
  }

  const handleChangePersonalInfo = (e) => {
    setPersonalInfo({
      ...personalInfo,
      [e.target.name]: e.target.value,
    })
  }

  // Handle saving changes for address
  const saveAddressChanges = (id) => {
    setEditingAddressId("");
    console.log("Sending address data:", editableAddress);
    const updatedAddress = editableAddress.find((address) => address.address_id === id);
    api
      .put(`/api/update-address/${id}`, updatedAddress)
      .then((response) => {
        if (response.data.success) {
          console.log('Address updated successfully:', response.data.data);
          setEditingAddressId(""); // Exit editing mode
        }
      })
      .catch((error) => {
        console.error('Error updating address:', error);
      });
  }

  // Handle saving changes for employment history
  const saveEmploymentChanges = (id) => {
    setEditingEmploymentId("");
    console.log("Sending employment data:", editableEmploymentHistory);
    const updatedEmployment = editableEmploymentHistory.find((job) => job.employment_id === id);
    api
      .put(`/api/update-employment-history/${id}`, updatedEmployment)
      .then((response) => {
        if (response.data.success) {
          console.log('Employment history updated successfully:', response.data.data);

          // Find the latest employment history with null or undefined as end_date
          const latestEmployment = editableEmploymentHistory.find((job) => !job.end_date);

          // Update current job title employer if latest job end date is null
          if (latestEmployment) {
            const profileUpdate = {
              current_job_title: latestEmployment.job_title,
              current_employer: latestEmployment.company,
            };

            // Send a PUT request to update the profile
            api
              .post('/api/update-profile', profileUpdate)
              .then((profileResponse) => {
                if (profileResponse.data.success) {
                  console.log('Profile updated successfully:', profileResponse.data.data);
                }
              })
              .catch((profileError) => {
                console.error('Error updating profile:', profileError);
              });
          }
          setEditingEmploymentId(""); // Exit editin  g mode
        }
      })
      .catch((error) => {
        console.error('Error updating employment history:', error);
      });
  };

  const handleDeletePhoto =  () => {
    setProfilePicture(`${import.meta.env.VITE_BACKEND_URL}/storage/profile_pictures/default-profile.jpg`);
    setProfile({
      ...profile,
      profile_picture: null,
    });
    setDeleteProfilePicture(true);
  }
  

  // Handle saving changes for education history
  const saveEducationChanges = (id) => {
    setEditingEducationId(""); // Exit editing mode
    console.log("Sending education data:", editableEducationHistory);

    const updatedEducation = editableEducationHistory.find((edu) => edu.education_id === id);

    api
      .put(`${import.meta.env.VITE_BACKEND_URL}/api/update-education-history/${id}`, updatedEducation)
      .then((response) => {
        if (response.data.success) {
          console.log('Education history updated successfully:', response.data.data);
          setEditingEducationId(""); // Exit editing mode
        }
      })
      .catch((error) => {
        console.error('Error updating education history:', error);
      });

  };

  const addNewAddress = () => {
    const newAddress = {
      address_id: `temp-${Date.now()}`,
      street: '',
      city: '',
      state: '',
      postal_code: '',
      country: '',
    };
    setEditableAddress([...editableAddress, newAddress]);
    setEditingAddressId(newAddress.address_id);
  }

  // Add new employment row in edit mode
  const addNewEmployment = () => {
    const newEmployment = {
      employment_id: `temp-${Date.now()}`, // Temporary ID for new row
      job_title: '',
      company: '',
      start_date: '',
      end_date: '',
      description: '',
    };
    setEditableEmploymentHistory([...editableEmploymentHistory, newEmployment]);
    setEditingEmploymentId(newEmployment.employment_id);
  };

  // Add new education row in edit mode
  const addNewEducation = () => {
    const newEducation = {
      education_id: `temp-${Date.now()}`, // Temporary ID for new row
      institution: '',
      degree: '',
      field_of_study: '',
      start_date: '',
      end_date: '',
    };
    setEditableEducationHistory([...editableEducationHistory, newEducation]);
    setEditingEducationId(newEducation.education_id);
  };

  const prepareNewEmployment = (employment) => {
    return {
      ...employment,
      // Ensure the date fields have a valid value or set to null if missing
      start_date: employment.start_date || null,
      end_date: employment.end_date || null,
    };
  };

  // Save new address entry to server
  const saveNewAddress = (address) => {
    api
      .post(`/api/add-address`, address)
      .then((response) => {
        if (response.data.success) {
          console.log('New address added successfully:', response.data.data);
          // Replace temporary ID with the actual ID from the response
          setEditableAddress((prev) =>
            prev.map(
              (addr) => addr.address_id === address.address_id ? response.data.data : addr
            )
          );
          setEditingAddressId("");
        }
      })
      .catch((error) => {
        console.error('Error adding new address:', error);
      });
  };

  // Save new employment entry to server
  const saveNewEmployment = (employment) => {
    const validEmployment = prepareNewEmployment(employment);
    api
      .post(`/api/add-employment-history`, validEmployment)
      .then((response) => {
        if (response.data.success) {
          console.log('New employment added successfully:', response.data.data);
          // Replace temporary ID with the actual ID from the response
          setEditableEmploymentHistory((prev) =>
            prev.map((job) =>
              job.employment_id === validEmployment.employment_id ? response.data.data : job
            )
          );
          setEditingEmploymentId("");
        }
      })
      .catch((error) => {
        console.error('Error adding new employment:', error);
      });
  };

  // Save new education entry to server
  const saveNewEducation = (education) => {
    api
      .post(`/api/add-education-history`, education)
      .then((response) => {
        if (response.data.success) {
          console.log('New education added successfully:', response.data.data);
          // Replace temporary ID with the actual ID from the response
          setEditableEducationHistory((prev) =>
            prev.map((edu) => (edu.education_id === education.education_id ? response.data.data : edu))
          );
          setEditingEducationId("");
        }
      })
      .catch((error) => {
        console.error('Error adding new education:', error);
      });
  };

  return (
    <>
      <div className="card mb-4 profile-section">
        {alert?.message && <CustomAlert severity={alert.severity} message={alert.message} onClose={handleCloseAlert} />}
        <h3 className="card-title">General Info</h3>
        <div className="row gap-3 align-items-center">

          {/* Profile Picture */}
          <div className="d-flex align-items-center profile-picture-settings">


            <div className="profile-image-container">
              {uploading ? <CircularLoader noOverlay={true} positionRelative={true} /> : <img src={profilePicture || 'profile_pictures/default-profile.jpg'} alt="Profile" className="profile-image rounded-circle" />}
            </div>

            <div className='d-flex flex-column ms-2'>
              <label className="form-label">Profile Picture</label>
              <p className="">{
                uploadSuccess ? `${profile?.profile_picture?.name} Uploaded Successfully` :
                  profile?.profile_picture?.name + " under 10MB" || "No Image Provided"
              }</p>
            </div>

            <div className="d-flex ms-auto ps-auto gap-1 justify-content-start align-items-center btn-profile-button">
              <label className="btn btn-outline-secondary btn-sm" htmlFor="photo-upload">Upload Picture</label>
              <input id='photo-upload' type="file" hidden accept="image/*" onChange={handlePhotoChange} />
              <button onClick={handleDeletePhoto} className="btn btn-outline-danger btn-sm ms-2">Delete Picture</button>
            </div>

          </div>

          {/* Profile Details Settings */}
          <div className="col-12 col-md-10 w-100">
            <div className="row mb-3">
              <div className="col-12 col-md-6 mb-3 mb-md-0">
                <label className="form-label">First Name</label>
                <input type="text" className="form-control" name='first_name' value={profile.first_name} onChange={handleChangeProfile} />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label">Last Name</label>
                <input type="text" className="form-control" name='last_name' value={profile.last_name} onChange={handleChangeProfile} />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-12 col-md-6 mb-3 mb-md-0">
                <label className="form-label">Email</label>
                <input disabled type="email" className="form-control" name='email' value={profile?.email || ''} onChange={handleChangeProfile} />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label">Phone</label>
                <input type="tel" className="form-control" name='phone' value={profile?.phone || ''} onChange={handleChangeProfile} />
              </div>
            </div>

            {/* Centering the button and adding responsive width */}
            <div className="d-flex">
              <button onClick={handleUpdateProfile} className="btn btn-primary">Save New Changes</button>
            </div>
          </div>

        </div>
      </div>

      {/* Personal Information & Contact Details Section */}
      <div className="card mb-4 profile-section">

        <h3 className="card-title">Personal Information & Contact Details</h3>
        <div className="col-12 col-md-10 w-100">
          <div className="row mb-3">
            <div className="col-12 col-md-6 mb-3 mb-md-0">
              <label className="form-label">Date of Birth</label>
              <input type="date" className="form-control" name='date_of_birth' value={personalInfo?.date_of_birth} onChange={handleChangePersonalInfo} />
            </div>

            <div className="col-12 col-md-6 mb-3 mb-md-0">
              <label className="form-label">LinkedIn Profile</label>
              <input type="text" className="form-control" name='linkedin_profile' value={personalInfo?.linkedin_profile} onChange={handleChangePersonalInfo} />
            </div>

          </div>
        </div>

        <div>
          <button onClick={handleUpdatePersonalInfo} className="btn btn-primary">Save New Changes</button>
        </div>

      </div>

      {/* Address Information */}
      <div className='card mb-4 profile-section'>
        <h3 className="card-title">Address Information</h3>
        <h5>Address Table</h5>
        <div className='table-responsive'>
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th scope="col">Street</th>
                <th scope="col">City</th>
                <th scope="col">State</th>
                <th scope="col">Postal Code</th>
                <th scope="col">Country</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {
                editableAddress.length > 0 ? (
                  editableAddress.map((address) => (
                    <tr key={address.address_id}>
                      <td data-cell="Street">
                        {editingAddressId === address.address_id ? (
                          <input
                            type="text"
                            className="form-control"
                            value={address.street || ''}
                            onChange={(e) => handleAddressChange(address.address_id, 'street', e.target.value)}
                          />
                        ) : (
                          address.street
                        )}
                      </td>
                      <td data-cell="City">
                        {editingAddressId === address.address_id ? (
                          <input
                            type="text"
                            className="form-control"
                            value={address.city || ''}
                            onChange={(e) => handleAddressChange(address.address_id, 'city', e.target.value)}
                          />
                        ) : (
                          address.city
                        )}
                      </td>
                      <td data-cell="State">
                        {editingAddressId === address.address_id ? (
                          <input
                            type="text"
                            className="form-control"
                            value={address.state || ''}
                            onChange={(e) => handleAddressChange(address.address_id, 'state', e.target.value)}
                          />
                        ) : (
                          address.state
                        )}
                      </td>
                      <td data-cell="Postal Code">
                        {editingAddressId === address.address_id ? (
                          <input
                            type="text"
                            className="form-control"
                            value={address.postal_code || ''}
                            onChange={(e) => handleAddressChange(address.address_id, 'postal_code', e.target.value)}
                          />
                        ) : (
                          address.postal_code
                        )}
                      </td>
                      <td data-cell="Country">
                        {editingAddressId === address.address_id ? (
                          <input
                            type="text"
                            className="form-control"
                            value={address.country || ''}
                            onChange={(e) => handleAddressChange(address.address_id, 'country', e.target.value)}
                          />
                        ) : (
                          address.country
                        )}
                      </td>
                      <td data-cell="Actions">
                        {editingAddressId === address.address_id ? (
                          <div className="btn-group" role='edit-address'>
                            <button className="btn btn-success btn-sm btn-save" onClick={() =>
                              typeof address.address_id === 'string' && address.address_id.includes('temp')
                                ? saveNewAddress(address)
                                : saveAddressChanges(address.address_id)
                            }>
                              <i className="fa-regular fa-floppy-disk"></i>
                            </button>
                            <button className="btn btn-sm btn-danger btn-delete">
                              <i className="fa-regular fa-trash-can btn-delete"></i>
                            </button>
                          </div>
                        ) : (
                          <button className="btn btn-warning btn  btn-light btn-sm" onClick={() => setEditingAddressId(address.address_id)}>
                            <i className="fa-regular fa-pen-to-square"></i>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    {/* <td colSpan="5">No address available.</td> Note: Delete when address_id is implemented */}
                    <td data-cell="Street">{address?.street}</td>
                    <td data-cell="City">{address?.city}</td>
                    <td data-cell="State">{address?.state}</td>
                    <td data-cell="Postal Code">{address?.postal_code}</td>
                    <td data-cell="Country">{address?.country}</td>
                    <td data-cell="Actions">TBD</td>
                  </tr>
                )
              }
              {/* Add New Address Button */}
              <tr>
                <td colSpan="6">
                  <button className="btn btn-outline-primary btn-sm rounded-circle" onClick={addNewAddress}>
                    <i className='fa-solid fa-plus'></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

        </div>

      </div>

      {/* Career & Education History Section */}
      <div className="card mb-4 profile-section">
        <h3 className="card-title">Career & Education History</h3>

        <div className="row mb-3">
          <div className="col-12 col-md-6">
            <label className="form-label">Current Job Title</label>
            <input type="text" className="form-control" name='current_job_title' value={profile.current_job_title} onChange={handleChangeProfile} />
          </div>
          <div className="col-12 col-md-6 mb-3 mb-md-0">
            <label className="form-label">Current Employer</label>
            <input type="text" className="form-control" name='current_employer' value={profile.current_employer} onChange={handleChangeProfile} />
          </div>
        </div>
        <div>
          <button onClick={handleUpdateCurrentEmployment} className="btn btn-primary">Save New Changes</button>
        </div>

        {/* Employment History */}
        <h5 className="mt-4 border-top pt-3">Employment History</h5>

        <div className='table-responsive'>
          <table className="table table-sm table-striped table-hover">
            <thead>
              <tr>
                <th scope="col">Job Title</th>
                <th scope="col">Description</th>
                <th scope="col">Company</th>
                <th scope="col">Start Date</th>
                <th scope="col">End Date</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {editableEmploymentHistory.length > 0 ? (
                editableEmploymentHistory.map((job) => (
                  <tr key={job.employment_id}>
                    <td data-cell="Job Title">
                      {editingEmploymentId === job.employment_id ? (
                        <input
                          type="text"
                          className="form-control"
                          value={job.job_title || ''}
                          onChange={(e) => handleEmploymentChange(job.employment_id, 'job_title', e.target.value)}
                        />
                      ) : (
                        job.job_title
                      )}
                    </td>
                    <td data-cell="Description">
                      {editingEmploymentId === job.employment_id ? (
                        <textarea
                          className="form-control auto-resize"
                          value={job.description || ''}
                          onChange={(e) => handleEmploymentChange(job.employment_id, 'description', e.target.value)}
                        />
                      ) : (
                        <details>
                          <summary className='job-summary'>{job.description ? job.description.substring(0, 30) + '...' : 'No description'}</summary>
                          <p>{job.description}</p>

                        </details>
                      )}
                    </td>
                    <td data-cell="Company">
                      {editingEmploymentId === job.employment_id ? (
                        <input
                          type="text"
                          className="form-control"
                          value={job.company || ''}
                          onChange={(e) => handleEmploymentChange(job.employment_id, 'company', e.target.value)}
                        />
                      ) : (
                        job.company
                      )}
                    </td>
                    <td data-cell="Start Date">
                      {editingEmploymentId === job.employment_id ? (
                        <input
                          type="date"
                          className="form-control"
                          value={job.start_date || ''}
                          onChange={(e) => handleEmploymentChange(job.employment_id, 'start_date', e.target.value)}
                        />
                      ) : (
                        new Date(job.start_date).toLocaleDateString()
                      )}
                    </td>
                    <td data-cell="End Date">
                      {editingEmploymentId === job.employment_id ? (
                        <input
                          type="date"
                          className="form-control"
                          value={job.end_date || ''}
                          onChange={(e) => handleEmploymentChange(job.employment_id, 'end_date', e.target.value)}
                        />
                      ) : (
                        job.end_date && new Date(job?.end_date).getFullYear() !== 0
                          ? new Date(job.end_date).toLocaleDateString() : 'Present'
                      )}
                    </td>
                    <td data-cell="Actions">
                      {editingEmploymentId === job.employment_id ? (
                        <div className="btn-group" role='edit-employment'>
                          <button className="btn btn-success btn-sm btn-save" onClick={() =>
                            typeof job.employment_id === 'string' && job.employment_id.includes('temp')
                              ? saveNewEmployment(job)
                              : saveEmploymentChanges(job.employment_id)
                          }>
                            <i className="fa-regular fa-floppy-disk"></i>
                          </button>
                          <button className="btn btn-sm btn-danger btn-delete">
                            <i className="fa-regular fa-trash-can btn-delete"></i>
                          </button>
                        </div>
                      ) : (
                        <button className="btn btn-warning btn-light btn-sm" onClick={() => setEditingEmploymentId(job.employment_id)}>
                          <i className="fa-regular fa-pen-to-square"></i>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td data-cell="Job Title" colSpan="6">No employment history available.</td>
                </tr>
              )
              }
              {/* Add New Employment Button */}
              <tr>
                <td colSpan="6">
                  <button className="btn btn-outline-primary btn-sm rounded-circle" onClick={addNewEmployment}>
                    <i className='fa-solid fa-plus'></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Education History */}
        <h5>Education History</h5>
        <div className='table-responsive'>
          <table className="table table-sm table-striped table-hover">
            <thead>
              <tr>
                <th scope="col">Degree</th>
                <th scope="col">Field of Study</th>
                <th scope="col">Institution</th>
                <th scope="col">Start Date</th>
                <th scope="col">End Date</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {editableEducationHistory.length > 0 ? (
                editableEducationHistory.map((edu) => (
                  <tr key={edu.education_id}>
                    <td data-cell="Degree">
                      {editingEducationId === edu.education_id ? (
                        <input
                          type="text"
                          className="form-control"
                          value={edu.degree || ''}
                          onChange={(e) => handleEducationChange(edu.education_id, 'degree', e.target.value)}
                        />
                      ) : (
                        edu.degree
                      )}
                    </td>
                    <td data-cell="Field of Study">
                      {editingEducationId === edu.education_id ? (
                        <input
                          type="text"
                          className="form-control"
                          value={edu.field_of_study || ''}
                          onChange={(e) => handleEducationChange(edu.education_id, 'field_of_study', e.target.value)}
                        />
                      ) : (
                        edu.field_of_study
                      )}
                    </td>
                    <td data-cell="Institution">
                      {editingEducationId === edu.education_id ? (
                        <input
                          type="text"
                          className="form-control"
                          value={edu.institution || ''}
                          onChange={(e) => handleEducationChange(edu.education_id, 'institution', e.target.value)}
                        />
                      ) : (
                        edu.institution
                      )}
                    </td>
                    <td data-cell="Start Date">
                      {editingEducationId === edu.education_id ? (
                        <input
                          type="date"
                          className="form-control"
                          value={edu.start_date || ''}
                          onChange={(e) => handleEducationChange(edu.education_id, 'start_date', e.target.value)}
                        />
                      ) : (
                        new Date(edu.start_date).toLocaleDateString()
                      )}
                    </td>
                    <td data-cell="End Date">
                      {editingEducationId === edu.education_id ? (
                        <input
                          type="date"
                          className="form-control"
                          value={edu.end_date || ''}
                          onChange={(e) => handleEducationChange(edu.education_id, 'end_date', e.target.value)}
                        />
                      ) : (
                        edu.end_date && new Date(edu?.end_date).getFullYear() !== 0
                          ? new Date(edu.end_date).toLocaleDateString() : 'Present'
                      )}
                    </td>
                    <td data-cell="Actions">
                      {editingEducationId === edu.education_id ? (
                        <div className='btn-group' role='edit-education'>
                          <button className="btn btn-success btn-sm btn-save" onClick={() =>
                            typeof edu.education_id === 'string' && edu.education_id.includes('temp')
                              ? saveNewEducation(edu)
                              : saveEducationChanges(edu.education_id)
                          }>
                            <i className="fa-regular fa-floppy-disk"></i>
                          </button>
                          <button className="btn btn-sm btn-danger mx-1">
                            <i className="fa-regular fa-trash-can btn-delete"></i>
                          </button>
                        </div>
                      ) : (
                        <button className="btn btn-warning btn-light btn-sm" onClick={() => setEditingEducationId(edu.education_id)}>
                          <i className="fa-regular fa-pen-to-square"></i>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td data-cell="Degree" colSpan="6">No education history available.</td>
                </tr>
              )}
              {/* Add New Education Button */}
              <tr>
                <td colSpan="6">
                  <button className="btn btn-outline-primary btn-sm" onClick={addNewEducation}>
                    <i className='fa-solid fa-plus'></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default ProfileSettings;