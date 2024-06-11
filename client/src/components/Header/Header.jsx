import React from "react";
import "./Header.css";
import Search from "../Search/Search";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faUser } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useUser } from "../../context/userContext";
import Myimage from '../../public/images/logo-mott.jpg'

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
          <FontAwesomeIcon icon={faUser} />
        )}
      </div>
    </div>
  );
};

export default Header;
