import React, { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faCaretLeft,
  faGear,
  faInfo,
  faEnvelope,
  faPlusCircle,
  faSignOut,
  faLanguage,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { useUser } from "../../context/userContext";
import { Link, NavLink } from "react-router-dom";
import defaultAvatar from "../../public/images/default-avatar.png";
import "../Sidebar/Sidebar.css";
import { faInstagram, faLinkedin } from "@fortawesome/free-brands-svg-icons";

const Sidebar = () => {
  const { user, logout } = useUser();
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const drawerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarActive(!isSidebarActive);
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleClickOutside = (event) => {
    if (
      drawerRef.current &&
      !drawerRef.current.contains(event.target) &&
      !event.target.closest(".faBars")
    ) {
      setIsDrawerOpen(false);
    }
  };

  useEffect(() => {
    if (isDrawerOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDrawerOpen]);

  return (
    <div className={`sidebar ${isSidebarActive ? "active" : ""}`}>
      <div className="menu-btn" onClick={toggleSidebar}>
        <FontAwesomeIcon
          icon={faCaretLeft}
          className={isSidebarActive ? "rotate-180" : ""}
        />
      </div>
      <div className="sidebar-head">
        <div className="user-img">
          <img
            src={
              user?.avatar
                ? `https://mott-server-f5c8bc5b637d.herokuapp.com${user.avatar}`
                : defaultAvatar
            }
            alt="User Avatar"
          />
        </div>
        <div className="user-details">
          <p className="sidebar-username">{user?.username}</p>
          {!user && !isMobile && (
            <button
              className="sign-in-button"
              onClick={() => (window.location.href = "/auth")}
            >
              Sign in
            </button>
          )}
        </div>
      </div>
      {user && (
        <Link to="/posts/create" className="add-post-button">
          <FontAwesomeIcon icon={faPlusCircle} />
          <span className="text">Create Post</span>
        </Link>
      )}
      <div className="nav">
        <div className="menu">
          <p className="title">Menu</p>
          <ul>
            {!user && !isMobile && (
              <>
                <li>
                  <NavLink to="/">
                    <FontAwesomeIcon icon={faHome} className="icon" />
                    <span className="text">Home</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/keyboard">
                    <FontAwesomeIcon icon={faLanguage} className="icon" />
                    <span className="text">Translate</span>
                  </NavLink>
                </li>
              </>
            )}
            {user && (
              <>
                <li>
                  <NavLink to="/messages">
                    <FontAwesomeIcon icon={faEnvelope} className="icon" />
                    <span className="text">Messages</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard">
                    <FontAwesomeIcon
                      icon={faGear}
                      className="icon settings-icon"
                    />
                    <span className="text">Settings</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/logout" onClick={logout}>
                    <FontAwesomeIcon icon={faSignOut} className="icon" />
                    <span className="text">Logout</span>
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
        <div className="menu">
          <p className="title">About</p>
          <ul>
            {!user && !isMobile && (
              <>
                <li>
                  <NavLink to="https://instagram.com">
                    <FontAwesomeIcon icon={faInstagram} className="icon" />
                    <span className="text">Instagram</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="https://linkedin.com">
                    <FontAwesomeIcon icon={faLinkedin} className="icon" />
                    <span className="text">LinkedIn</span>
                  </NavLink>
                </li>
              </>
            )}
            <li>
              <NavLink to="/faq">
                <FontAwesomeIcon icon={faInfo} className="icon" />
                <span className="text">FAQ</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/privacy-policy">
                <span className="text">Privacy Policy</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
      {isMobile && (
        <>
          <div className="mobile-bottom-bar">
            <NavLink to="/">
              <FontAwesomeIcon icon={faHome} className="icon" />
            </NavLink>
            <button onClick={toggleDrawer}>
              <FontAwesomeIcon icon={faBars} className="icon" />
            </button>
          </div>
          <div ref={drawerRef} className={`drawer ${isDrawerOpen ? "open" : ""}`}>
            <div className="drawer-header">
              <button onClick={toggleDrawer} className="close-btn">
                <FontAwesomeIcon icon={faBars} />
              </button>
              {user && (
                <div className="drawer-user-details">
                  <img
                    src={
                      user?.avatar
                        ? `https://mott-server-f5c8bc5b637d.herokuapp.com${user.avatar}`
                        : defaultAvatar
                    }
                    alt="User Avatar"
                  />
                  <p className="drawer-username">{user?.username}</p>
                  <p className="drawer-email">{user?.email}</p>
                </div>
              )}
            </div>
            <ul className="drawer-menu">
              <li>
                <NavLink to="/">
                  <FontAwesomeIcon icon={faHome} className="icon" />
                  <span className="text">Home</span>
                </NavLink>
              </li>
              {!user && (
                <>
                  <li>
                    <NavLink to="https://instagram.com">
                      <FontAwesomeIcon icon={faInstagram} className="icon" />
                      <span className="text">Instagram</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="https://linkedin.com">
                      <FontAwesomeIcon icon={faLinkedin} className="icon" />
                      <span className="text">LinkedIn</span>
                    </NavLink>
                  </li>
                </>
              )}
              <li>
                <NavLink to="/faq">
                  <FontAwesomeIcon icon={faInfo} className="icon" />
                  <span className="text">FAQ</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/privacy-policy">
                  <span className="text">Privacy Policy</span>
                </NavLink>
              </li>
              {user && (
                <>
                  <li>
                    <NavLink to="/messages">
                      <FontAwesomeIcon icon={faEnvelope} className="icon" />
                      <span className="text">Messages</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/dashboard">
                      <FontAwesomeIcon
                        icon={faGear}
                        className="icon settings-icon"
                      />
                      <span className="text">Settings</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/logout" onClick={logout}>
                      <FontAwesomeIcon icon={faSignOut} className="icon" />
                      <span className="text">Logout</span>
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
