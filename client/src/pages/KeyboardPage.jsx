import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import '../public/styles/Keyboard.css'

const KeyboardPage = () => {
  const [inputValue, setInputValue] = useState("");
  const [isCapsLock, setIsCapsLock] = useState(false);


  const toggleCapsLock = () => setIsCapsLock(!isCapsLock);

  const addLetter = (letter) =>
    setInputValue(
      (prev) => prev + (isCapsLock ? letter.toUpperCase() : letter)
    );

  const clearInput = () => setInputValue("");

  const handleInputChange = (event) => setInputValue(event.target.value);

  const rows = [
    ["a", "ä", "b", "c", "ċ", "ç"],
    ["ç̇", "d", "e", "f", "g", "ġ"],
    ["h", "x", "ẋ", "i", "ƶ", "k"],
    ["kh", "q", "q̇", "l", "m", "n"],
    ["o", "ö", "p", "ph", "r", "s"],
    ["ş", "t", "th", "u", "ü", "v"],
    ["y", "z", "j", "ə", "ŋ", ","],
    ["CAPS"],
  ];

  const handleButtonClick = (letter) => {
    if (letter === "CAPS") {
      toggleCapsLock();
    } else {
      addLetter(letter);
    }
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(inputValue);
    const whatsappUrl = `https://wa.me/?text=${text}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleGmailShare = () => {
    const subject = encodeURIComponent("Check this text from our site");
    const body = encodeURIComponent(inputValue);
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=&su=${subject}&body=${body}`;
    window.open(gmailUrl, "_blank");
  };

  return (
    <div className="keyboard-container">
      <div className="input-container">
        <textarea
          value={inputValue}
          onChange={handleInputChange}
          className="keyboard-input"
          rows="3"
        />
        {inputValue && (
          <FontAwesomeIcon
            icon={faTimes}
            onClick={clearInput}
            className="clear-icon"
          />
        )}
      </div>
      <div className="keyboard">
        {rows.map((row, index) => (
          <div key={index} className="keyboard-row">
            {row.map((letter) => (
              <button
                key={letter}
                onClick={() => handleButtonClick(letter)}
                className={`keyboard-button ${
                  letter === "CAPS" && isCapsLock ? "active" : ""
                } ${letter === "CAPS" ? "caps" : ""}`}
              >
                {letter !== "CAPS"
                  ? isCapsLock
                    ? letter.toUpperCase()
                    : letter
                  : "CAPS"}
              </button>
            ))}
          </div>
        ))}
      </div>
      <button onClick={handleWhatsAppShare}>WhatsApp çuxol yaẋita</button>
      <button onClick={handleGmailShare}>Gmail çuxol yaẋita</button>
    </div>
  );
};

export default KeyboardPage;
