import React from "react";
import "./Header.css";
import Search from "../Search/Search";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faPowerOff, faUser } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useUser } from "../../context/userContext";
import Myimage from "../../public/images/mott-logo.png";

const Header = () => {
  const { user, logout } = useUser();

  return (
    <div className="header-container">
      <div className="logo-block">
        <img src={Myimage} alt="img" />
      </div>
      <div className="search-block">
        <Search />
      </div>
      <div className="header-user-block">
        {!user ? (
          <Link to="/auth" className="header-link">
            Sign In
          </Link>
        ) : (
          <div className="logout-block">
            <p className="logout-btn" onClick={logout}>
              Logout
            </p>
            <FontAwesomeIcon className="off-icon" icon={faPowerOff} />

          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
