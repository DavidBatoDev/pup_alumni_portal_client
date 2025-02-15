import React from 'react';
import { Link } from 'react-router-dom';
import './Banner.css';
import { useNavigate } from 'react-router-dom';

const BannerSmall = ({ bannerTitle, bannerImage, breadcrumbs = [], bannnerContain }) => {
  const navigate = useNavigate();
  return (
  <div className="banner-small" style={{ 
    backgroundImage: `url(${bannerImage})`, 
    backgroundSize: bannnerContain ? 'contain' : 'cover',
    backgroundPosition: 'center', 
    backgroundRepeat: 'no-repeat' 
  }}>
      <div className="banner-content">
        {/* add a back button here */}
        <button className="btn back-btn" onClick={() => navigate(-1)}>
          <i className="fas fa-chevron-left"></i> Back
        </button>
        <div className="banner-small-title-wrapper">
          <h1 className="banner-small-title">{bannerTitle}</h1>
          <div className="rsvp-container">
            <button className="btn btn-primary rsvp-btn">RSVP Now</button>
            {/* Tooltip */}
            <div className="rsvp-tooltip">
              Please be sure to Login first
              <div className="rsvp-tooltip-arrow"></div> {/* Arrow for tooltip */}
            </div>
          </div>
        </div>

        {/* Breadcrumb Navigation (optional) */}
        {breadcrumbs.length > 0 && (
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center">
              {breadcrumbs.map((breadcrumb, index) => (
                <li
                  key={index}
                  className={`breadcrumb-item ${index === breadcrumbs.length - 1 ? 'active' : ''}`}
                  aria-current={index === breadcrumbs.length - 1 ? 'page' : undefined}
                >
                  {index === breadcrumbs.length - 1 ? (
                    breadcrumb.label // If it's the last breadcrumb, show it as plain text
                  ) : (
                    <Link to={breadcrumb.link}>{breadcrumb.label}</Link> // Else, show it as a link
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
      </div>
    </div>
  );
};

export default BannerSmall;
