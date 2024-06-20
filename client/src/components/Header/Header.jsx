import React from "react";
import "./Header.css";
import Search from "../Search/Search";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faPowerOff, faSignOut, faUser } from "@fortawesome/free-solid-svg-icons";
import { Link, NavLink } from "react-router-dom";
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
            Çuvala
          </Link>
        ) : (
          <div className="logout-block">
            <li>
              <NavLink to="/logout" onClick={logout}>
                <FontAwesomeIcon icon={faSignOut} className="icon" />
                <span className="text">Logout</span>
              </NavLink>
            </li>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
