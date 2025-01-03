import React, { useState } from "react";
import { useSelector } from "react-redux";
import "./AuthenticatedNavbar.css";
import { useNavigate } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
import PupLogo from "../../assets/images/pup-logo.png";
import GraduateLogo from "../../assets/images/graduate-logo.png";
import BagongPilipinasLogo from "../../assets/images/bagong-pilipinas-logo.png";
import NotificationMenu from "../NotificationMenu/NotificationMenu";
import userIcon from "../../assets/images/user.png";

const AuthenticatedNavbar = ({backgroundImage}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.user);

  // State to track the drawer visibility
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Handle drawer toggle
  const toggleDrawer = () => {
    setDrawerOpen((prev) => !prev);
  };

  // Handle link click and close drawer
  const handleNavLinkClick = (sectionId) => {
    navigate(`/${sectionId}`);
  };

  const navItems = [
    { id: "events", label: "Events" },
    { id: "surveys", label: "Surveys" },
    { id: "alumni", label: "Alumni" },
    { id: "discussions", label: "Discussions" },
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light py-0 shadow-sm" style={{backgroundImage: `url(${backgroundImage})`}}>
      <div className="container d-flex justify-content-between align-items-center">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <div className="d-flex align-items-center">
            <img
              src={PupLogo}
              alt="PUP Logo"
              width="65"
              height="65"
              className="navbar-logo"
            />
            <img
              src={GraduateLogo}
              alt="Graduate Logo"
              width="65"
              height="65"
              className="navbar-logo ms-2"
            />
            <img
              src={BagongPilipinasLogo}
              alt="Bagong Pilipinas Logo"
              width="65"
              height="65"
              className="navbar-logo ms-2"
            />
          </div>
          <div className="header-title-container ms-3">
            <span className="header-title fw-bold cinzel">
              Polytechnic University of the Philippines
            </span>
            <span className="header-title fw-bold cinzel">
              Graduate School Alumni Engagement Portal System
            </span>
          </div>
        </Link>
        {/* Hamburger button for mobile view */}
        <button
          className="navbar-toggler"
          type="button"
          aria-label="Toggle navigation"
          onClick={toggleDrawer}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Desktop menu */}
        <div
          className="collapse navbar-collapse d-none d-lg-block"
          id="navbarNav"
        >
          <ul className="navbar-nav ms-auto">
            {navItems.map((item) => (
              <li className="nav-item" key={item.id}>
                <button
                  className="nav-link"
                  onClick={() => handleNavLinkClick(item.id)}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
          <div className="auth-container">
            <NotificationMenu />
            <div className="profile-container">
              {user ? (
                <Link to="/profile" className="profile-link">
                  {user?.profile_picture
                    ? <img
                      src={user?.profile_picture ? `${import.meta.env.VITE_BACKEND_URL}/storage/${user?.profile_picture}` : '/pfp.jpg'}
                      alt={`${user.first_name}'s profile`}
                      className="img-fluid rounded-circle navbar-profile-image"
                    /> :
                    <img
                      src={userIcon}
                      alt={`${user.first_name}'s profile`}
                      className="img-fluid rounded-circle navbar-profile-image"
                    />
                  }

                </Link>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="btn btn-nav-signin ms-3"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar drawer for mobile view */}
      <div className={`drawer ${drawerOpen ? "drawer-open" : "none"}`}>
        {/* Close button inside the drawer */}
        <button
          className="drawer-close-btn"
          aria-label="Close Drawer"
          onClick={toggleDrawer}
        >
          &times;
        </button>
        <ul className="drawer-nav">
          {navItems.map((item) => (
            <li className="drawer-item" key={item.id}>
              <button
                className="drawer-link"
                onClick={() => handleNavLinkClick(item.id)}
              >
                {item.label}
              </button>
            </li>
          ))}
          {/* Notification bell icon */}
          <NotificationMenu />
          {/* <button className="btn btn-notification"> */}
          {/* </button> */}
          <a className="drawer-item">
            {user ? (
              <Link to="/profile" className="drawer-link">
                {user?.profile_picture
                  ? <img
                    src={user?.profile_picture ? `${import.meta.env.VITE_BACKEND_URL}/storage/${user?.profile_picture}` : '/pfp.jpg'}
                    alt={`${user.first_name}'s profile`}
                    className="img-fluid rounded-circle navbar-profile-image"
                  /> :
                  <img
                    src={userIcon}
                    alt={`${user.first_name}'s profile`}
                    className="img-fluid rounded-circle navbar-profile-image"
                  />
                }
              </Link>
            ) : (
              <button
                onClick={() => {
                  setDrawerOpen(false);
                  navigate("/login");
                }}
                className="btn btn-nav-signin mt-3"
              >
                Sign In
              </button>
            )}
          </a>
        </ul>
      </div>

      {/* Overlay to close drawer when clicking outside */}
      {drawerOpen && (
        <div className="drawer-overlay" onClick={() => setDrawerOpen(false)} />
      )}
    </nav>
  );
};

export default AuthenticatedNavbar;
