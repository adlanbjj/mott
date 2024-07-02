import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUsers,
  faCaretLeft,
  faGear,
  faInfo,
  faEnvelope,
  faPlusCircle,
  faSignOut,
  faLanguage,
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


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarActive(!isSidebarActive);
  };

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
          src={user?.avatar ? `https://mott-server-f5c8bc5b637d.herokuapp.com${user.avatar}` : defaultAvatar}
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
            Çuġo
          </button>
        )}
      </div>
    </div>
    {user && (
      <Link to="/posts/create" className="add-post-button">
        <FontAwesomeIcon icon={faPlusCircle} />
        <span className="text">Yuq̇toxa Post</span>
      </Link>
    )}
    <div className="nav">
      <div className="menu">
        <p className="title">Körta menu</p>
        <ul>
          <li>
            <NavLink to="/">
              <FontAwesomeIcon icon={faHome} className="icon" />
              <span className="text">Körta aġo</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/keyboard">
              <FontAwesomeIcon icon={faLanguage} className="icon" />
              <span className="text">Klaviatur</span>
            </NavLink>
          </li>
          {/* <li>
            <NavLink to="/user-list">
              <FontAwesomeIcon icon={faUsers} className="icon" />
              <span className="text">Ƶigarxoy</span>
            </NavLink>
          </li> */}
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
          <p className="title">Account</p>
          <ul>
            <li>
              <NavLink to="/dashboard">
                <FontAwesomeIcon icon={faGear} className="icon" />
                <span className="text">Settings</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/logout" onClick={logout}>
                <FontAwesomeIcon icon={faSignOut} className="icon" />
                <span className="text">Logout</span>
              </NavLink>
            </li>
          </ul>
        </div>
      )}
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
            <NavLink to="/faq">
              <span className="text">Privacy Policy</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  </div>
  );
};

export default Sidebar;
