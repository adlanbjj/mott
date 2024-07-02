import React, { useState } from "react";
import "./Header.css";
import Search from "../Search/Search";
import Myimage from "../../public/images/mott-logo.png";
import chechenFlag from "../../public/images/chechen-flag.png";
import englishFlag from "../../public/images/english-flag.png";

const Header = () => {
  const [language, setLanguage] = useState("Che");
  const [flag, setFlag] = useState(chechenFlag);

  const handleLanguageChange = (lang, flag) => {
    setLanguage(lang);
    setFlag(flag);
  };

  return (
    <div className="header-container">
      <div className="logo-block">
        <img src={Myimage} alt="img" />
      </div>
      <div className="search-block">
        <Search />
      </div>
      <div className="header-user-block">
       
        <div className="language-selector">
          <button>
            {language} <img src={flag} alt="flag" />
          </button>
          <div className="language-dropdown">
            <a href="/" onClick={() => handleLanguageChange("Che", chechenFlag)}>
              Chechen <img src={chechenFlag} alt="Chechen flag" />
            </a>
            <a href="/" onClick={() => handleLanguageChange("Eng", englishFlag)}>
              English <img src={englishFlag} alt="English flag" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
