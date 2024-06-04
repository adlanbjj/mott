import React from "react";
import "./Header.css";
import Search from "../Search/Search";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faUser } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import AuthPage from "../../pages/AuthPage";

const Header = () => {
  return (
    <div className="header-container">
      <div className="logo-block">
        <h1>mott</h1>
      </div>
      <div className="search-block">
        <Search />
      </div>
      <div className="header-user-block">
      <Link to="/auth" className="header-link">
          Sign In
        </Link>
        <FontAwesomeIcon icon={faUser} />
        <FontAwesomeIcon icon={faBell} />
      </div>
    </div>
  );
};

export default Header;
