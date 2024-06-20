import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUser,
  faKeyboard,
  faUsers,
  faSignOut,
  faCaretLeft,
  faGear,
  faInfo,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { useUser } from "../../context/userContext";
import { Link, NavLink } from "react-router-dom";
import defaultAvatar from "../../public/images/default-avatar.png";
import "../Sidebar/Sidebar.css";
import { faGithub, faInstagram, faLinkedin } from "@fortawesome/free-brands-svg-icons";

const Sidebar = () => {
  const { user, logout } = useUser();
  const userAva = defaultAvatar;
  const [isSidebarActive, setIsSidebarActive] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarActive(!isSidebarActive);
  };

  return (
    <div className={`sidebar ${isSidebarActive ? "active" : ""}`}>
      <div className="menu-btn" onClick={toggleSidebar}>
        <FontAwesomeIcon icon={faCaretLeft} className={isSidebarActive ? "rotate-180" : ""} />
      </div>
      <div className="head">
        <div className="user-img">
          <img src={user?.avatar ? `http://localhost:3001${user.avatar}` : userAva} alt="User Avatar" />
        </div>
        <div className="user-details">
          <p className="title">UI/UX Designer</p>
          <p className="name">{user?.username}</p>
        </div>
      </div>
      <div className="nav">
        <div className="menu">
          <p className="title">Main</p>
          <ul>
            <li>
              <NavLink to="/">
                <FontAwesomeIcon icon={faHome} className="icon" />
                <span className="text">Körta aġo</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/keyboard">
                <FontAwesomeIcon icon={faKeyboard} className="icon" />
                <span className="text">Klaviatur</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/user-list">
                <FontAwesomeIcon icon={faUsers} className="icon" />
                <span className="text">Ƶigarxoy</span>
              </NavLink>
            </li>
            {user && (
              <li>
                <NavLink to="/messages">
                  <FontAwesomeIcon icon={faEnvelope} className="icon" />
                  <span className="text">Kexataş</span>
                </NavLink>
              </li>
            )}
          </ul>
        </div>
        {user && (
          <div className="menu">
            <p className="title">Settings</p>
            <ul>
              <li>
                <NavLink to="/dashboard">
                  <FontAwesomeIcon icon={faGear} className="icon" />
                  <span className="text">Settings</span>
                </NavLink>
              </li>
            </ul>
          </div>
        )}
        <div className="menu">
          <p className="title">Social media</p>
          <ul>
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
          </ul>
        </div>
        <div className="menu">
          <p className="title">About</p>
          <ul>
            <li>
              <NavLink to="/faq">
                <FontAwesomeIcon icon={faInfo} className="icon" />
                <span className="text">FAQ</span>
              </NavLink>
            </li>
           
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
