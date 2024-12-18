import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './ModalContainer.css';

const ModalContainer = ({ showModal, closeModal, title = 'Modal Title', children, hideHeader = false, fullView = false, hidePadding, fitcontent, mobileModal }) => {
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    if (showModal) {
      setAnimationClass('open');
    } else {
      setAnimationClass('close');
    }
  }, [showModal]);

  return (
    <div className={`desktop-modal ${showModal ? 'show' : ''} ${animationClass} ${fullView ? 'full-view' : ''}`}>
      <div className={`desktop-modal-overlay ${animationClass} cursor-pointer`} onClick={closeModal}  />
      <div className={`desktop-modal-content position-relative ${animationClass} ${fullView ? 'full-view' : ''} ${fitcontent ? 'fit-content' : ''} ${mobileModal ? 'mobile-modal' : ''}`}>
        <div className={`desktop-modal-header ${mobileModal ? 'mobile-modal' : ''} ${hideHeader ? 'hidden' : ''}`}>
          <h2 className="desktop-modal-title">{title}</h2>
          <button className="close-btn" onClick={closeModal}>&times;</button>
        </div>
        <div className={`desktop-modal-body ${fullView ? 'full-view' : ''} ${hidePadding ? 'p-0' : ""} ${fitcontent ? 'fit-content' : ''} ${mobileModal ? 'mobile-modal' : ''}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

ModalContainer.propTypes = {
  showModal: PropTypes.bool.isRequired,
  closeModal: PropTypes.func,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  hideHeader: PropTypes.bool,
  fullView: PropTypes.bool,
};



export default ModalContainer;
