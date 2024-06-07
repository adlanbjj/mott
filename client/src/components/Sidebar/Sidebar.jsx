import React from "react";
import "./Sidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faUser } from "@fortawesome/free-solid-svg-icons";
import { useUser } from "../../context/userContext";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const { user, logout } = useUser();

  return (
    <div className="sidebar-container">
    <div className="sidebar-up-block">
      {user && (
        <>
          <button>Add post</button>
          <button>Edit profile</button>
        </>
      )}
    </div>
    <div className="sidebar-midle-block">
      <Link to="/" className="sidebar-link">Homepage</Link>
      <Link to="/words" className="sidebar-link">Words</Link>
      <Link to="/keyboard" className="sidebar-link">Keyboard</Link>
      <Link to="/top-users" className="sidebar-link">Top-users</Link>
      {user && <Link to="/messages" className="sidebar-link">Messages</Link>}
    </div>
    {user && (
      <div className="sidebar-bottom-block">
        <button onClick={logout}>Logout</button>
        <FontAwesomeIcon icon={faUser} />
        <FontAwesomeIcon icon={faEnvelope} />
      </div>
    )}
  </div>
  );
};

export default Sidebar;
