// src/components/HomePageFooter/MainFooter.jsx
import React, { useState } from 'react';
import './MainFooter.css';
import TermsOfService from '../TermsOfService/TermsOfService';
import PrivacyPolicy from '../PrivacyPolicy/PrivacyPolicy';

const MainFooter = () => {
  const [showTOSModal, setShowTOSModal] = useState(false);
  const [showPrivacyPolicyModal, setShowPrivacyPolicyModal] = useState(false);

  const handleTOSClick = (event) => {
    event.preventDefault();
    setShowTOSModal(true);
  };

  const handlePrivacyPolicyClick = (event) => {
    event.preventDefault();
    setShowPrivacyPolicyModal(true);
  };

  return (
    <footer className="homepage-footer">
      <div className="container">
        <div className="row">
          {/* Quick Links */}
          <div className="col-md-4 footer-column">
            <h4 className="footer-heading">QUICK LINKS</h4>
            <ul className="footer-links">
              <li><a href="#">Home</a></li>
              <li><a href="#events">Events</a></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#about-us">About Us</a></li>
              <li><a href="#contact">Contact Us</a></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="col-md-4 footer-column">
            <h4 className="footer-heading">Contact Information</h4>
            <p>M.H Del Pilar Campus, Sta. Mesa, Manila, Philippines</p>
            <p>Email: gs@pup.edu.ph</p>
            By using this service, you understood and agree to the PUP GS:
            <br />
            <a href="#" className="footer-link" onClick={handleTOSClick}>Terms of Use</a> and <a href="#" className="footer-link" onClick={handlePrivacyPolicyClick}>Privacy Policy</a>.
          </div>

          {/* Social Media Icons */}
          <div className="col-md-4 footer-column">
            <h4 className="footer-heading">SOCIAL MEDIA</h4>
            <div className="footer-social-icons">
              <a href="https://www.facebook.com/PUPGSOfficial" target='_blank' className="social-icon"><i className="fab fa-facebook"></i></a>
              <a href="https://www.pup.edu.ph/PUPGS/" className="social-icon"><i className="fa fa-globe" aria-hidden="true"></i></a>
            </div>
          </div>
        </div>
      </div>

      {showTOSModal && <TermsOfService closeModal={() => setShowTOSModal(false)} />}
      {showPrivacyPolicyModal && <PrivacyPolicy closeModal={() => setShowPrivacyPolicyModal(false)} />}
    </footer>
  );
};

export default MainFooter;
