import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../../assets/images/pup-logo.png';
import './AdminSidebar.css';
import { useSelector } from 'react-redux';
import { logout } from '../../store/UserSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import ModalContainer from '../ModalContainer/ModalContainer';

const AdminSidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();



  const menuItems = [
    { name: 'Event Management', path: '/admin/events', icon: 'fa-calendar-alt' },
    { name: 'Survey & Feedback', path: '/admin/survey-feedback', icon: 'fa-poll' },
    {/*
    { name: 'Career Support', path: '/admin/career-support', icon: 'fa-briefcase' },
    { name: 'Chat & Discussions', path: '/admin/chat-discussions', icon: 'fa-comments' },
    { name: 'Volunteer & Donation', path: '/admin/volunteer-donation', icon: 'fa-hand-holding-heart' },
    { name: 'Settings', path: '/admin/settings', icon: 'fa-cog' },
    */}
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div>
      {/* Mobile Navbar with a unique ID */}
      <nav className="navbar navbar-expand-lg navbar-dark as-navbar d-md-none">
        <div className="navbar-brand">
          <img src={Logo} alt="Admin Logo" className="as-navbar-logo" />
        </div>
        {/* Sidebar toggle button for mobile view */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleSidebar}
          aria-controls="asAdminSidebarContent"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible Sidebar Menu for Mobile */}
        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="asAdminSidebarContent">
          <div className="as-sidebar mobile-sidebar">
            <ul className="as-sidebar-menu navbar-nav">
              {menuItems.map((item) => (
                <li
                  key={item.name}
                  className={`as-sidebar-menu-item nav-item ${location.pathname === item.path ? 'active' : ''}`}
                >
                  <Link to={item.path} className="nav-link" onClick={toggleSidebar}>
                    <i className={`fas ${item.icon} me-2`}></i>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="as-sidebar-footer">
              <div className="btn btn-danger as-logout-btn" onClick={() => setLogoutModal(true)}>
                <i className="fas fa-sign-out-alt me-2"></i>
                Logout
              </div>
            </div>
          </div>
        </div>
      </nav>
      

      {/* Regular Sidebar for Desktop View */}
      <div className="as-sidebar d-none d-md-flex flex-column">
        <div className="as-sidebar-header">
        <div className="navbar-brand">
          <img src={Logo} alt="Admin Logo" className="as-sidebar-logo" />
        </div>
        </div>
        <ul className="as-sidebar-menu nav flex-column">
          {menuItems.map((item) => (
            <li
              key={item.name}
              className={`as-sidebar-menu-item nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <Link to={item.path} className="nav-link">
                <i className={`fas ${item.icon} me-2`}></i>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
        <div className="as-sidebar-footer">
          <div className="btn btn-danger as-logout-btn"  onClick={() => setLogoutModal(true)}>
            <i className="fas fa-sign-out-alt me-2"></i>
            Logout
          </div>
        </div>
      </div>


      {/* Logout Modal */}
      <ModalContainer
        showModal={logoutModal}
        hideHeader={true}
        mobileModal={true}
        fitcontent={true}
      >
        <div className="as-logout-modal">
          <div className="as-logout-modal-body">
            <h4 className="as-logout-modal-title">Are you sure you want to logout?</h4>
            <div className="as-logout-modal-buttons">
              <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
              <button className="btn btn-secondary" onClick={() => setLogoutModal(false)}>Cancel</button>
            </div>
          </div>
        </div>

      </ModalContainer>

    </div>
  );
};

export default AdminSidebar;
