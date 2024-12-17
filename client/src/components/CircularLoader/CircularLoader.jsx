import React from 'react';
import './CircularLoader.css';

const CircularLoader = ({noOverlay}) => {
  return (
    <div className={`loader-overlay ${noOverlay ? 'no-overlay' : ''}`}>
      <div className="loader-container">
        <div className="custom-loader" />
      </div>
    </div>
  );
};

CircularLoader.defaultProps = {
  noOverlay: false,
};

export default CircularLoader;
