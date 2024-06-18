import React from "react";
import "../Sidebar/Sidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faUser } from "@fortawesome/free-solid-svg-icons";
import { useUser } from "../../context/userContext";
import { Link, NavLink } from "react-router-dom";
import defaultAvatar from "../../public/images/default-avatar.png";
import {
  faInstagram,
  faLinkedin,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";

const Sidebar = () => {
  const { user, logout } = useUser();
  const userAva = defaultAvatar;

  return (
    <div className="sidebar-container">
      <div
        className={`sidebar-up-block ${user ? "authenticated-background" : ""}`}
      >
        {user && (
          <>
            <img src={user.avatar ? `http://localhost:3001${user.avatar}` : userAva} alt="User Avatar" className="user-avatar" />
            <div className="username">{user.username}</div>
            <Link to="/posts/create">
              <button>Create Post</button>
            </Link>
            <Link to="/dashboard">
              <button>Edit profile</button>
            </Link>
          </>
        )}
      </div>
      <div className="sidebar-middle-block">
        <NavLink
          to="/"
          className={({ isActive }) =>
            "sidebar-link" + (isActive ? " active" : "")
          }
        >
          Homepage
        </NavLink>
        <NavLink
          to="/keyboard"
          className={({ isActive }) =>
            "sidebar-link" + (isActive ? " active" : "")
          }
        >
          Keyboard
        </NavLink>
        <NavLink
          to="/user-list"
          className={({ isActive }) =>
            "sidebar-link" + (isActive ? " active" : "")
          }
        >
          Top-users
        </NavLink>
        {user && (
          <NavLink
            to="/messages"
            className={({ isActive }) =>
              "sidebar-link" + (isActive ? " active" : "")
            }
          >
            Messages
          </NavLink>
        )}
      </div>

      <div className="sidebar-bottom-block">
        <FontAwesomeIcon className="bottom-block-icon" icon={faInstagram} />
        <FontAwesomeIcon className="bottom-block-icon" icon={faGithub} />
        <FontAwesomeIcon className="bottom-block-icon" icon={faLinkedin} />
      </div>
    </div>
  );
};

export default Sidebar;
