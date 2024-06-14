import React from "react";
import "../Sidebar/Sidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faUser } from "@fortawesome/free-solid-svg-icons";
import { useUser } from "../../context/userContext";
import { NavLink } from "react-router-dom";
import defaultAvatar from "../../public/images/default-avatar.png";

const Sidebar = () => {
  const { user, logout } = useUser();
  const userAva = defaultAvatar;

  return (
    <div className="sidebar-container">
      <div className={`sidebar-up-block ${user ? 'authenticated-background' : ''}`}>
        {user && (
          <>
            <img src={user.avatar || userAva} alt="User Avatar" />
            {user.username}
            <button>Add post</button>
            <button>Edit profile</button>
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
          to="/words"
          className={({ isActive }) =>
            "sidebar-link" + (isActive ? " active" : "")
          }
        >
          Words
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
          to="/top-users"
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
      {user && (
        <div className="sidebar-bottom-block">
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
