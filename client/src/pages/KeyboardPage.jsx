import React, { useState } from "react";
import "../public/styles/Keyboard.css";

const translitMap = {
  а: "a",
  А: "A",
  аь: "ä",
  Аь: "Ä",
  б: "b",
  Б: "B",
  с: "c",
  С: "C",
  ц1: "ċ",
  Ц1: "Ċ",
  ч: "ç",
  Ч: "Ç",
  ч1: "ç̇",
  Ч1: "Ç̇",
  д: "d",
  Д: "D",
  е: "e",
  Е: "E",
  ф: "f",
  Ф: "F",
  г: "g",
  Г: "G",
  г1: "ġ",
  Г1: "Ġ",
  х: "h",
  Х: "H",
  хь: "ẋ",
  Хь: "Ẋ",
  и: "i",
  И: "I",
  ж: "ƶ",
  Ж: "Ƶ",
  к: "k",
  К: "K",
  к1: "kh",
  К1: "Kh",
  кх: "q",
  КХ: "Q",
  къ: "q̇",
  КЪ: "Q̇",
  л: "l",
  Л: "L",
  м: "m",
  М: "M",
  н: "n",
  Н: "N",
  о: "o",
  О: "O",
  оь: "ö",
  Оь: "Ö",
  п: "p",
  П: "P",
  п1: "ph",
  П1: "Ph",
  р: "r",
  Р: "R",
  с: "s",
  С: "S",
  ш: "ş",
  Ш: "Ş",
  т: "t",
  Т: "T",
  т1: "th",
  Т1: "Th",
  у: "u",
  У: "U",
  уь: "ü",
  Уь: "Ü",
  в: "v",
  В: "V",
  й: "y",
  Й: "Y",
  з: "z",
  З: "Z",
  1: "j",
  Ӏ: "J",
  ",": ",",
};

const transliterate = (text) => {
  let result = "";
  for (let i = 0; i < text.length; i++) {
    if (i < text.length - 1) {
      const twoChar = text[i] + text[i + 1];
      if (translitMap[twoChar]) {
        result += translitMap[twoChar];
        i++;
        continue;
      }
    }
    result += translitMap[text[i]] || text[i];
  }
  return result;
};

const TranslitPage = () => {
  const [inputValue, setInputValue] = useState("");
  const [translitValue, setTranslitValue] = useState("");

  const handleInputChange = (event) => {
    const text = event.target.value;
    setInputValue(text);
    setTranslitValue(transliterate(text));
  };

  const clearInput = () => {
    setInputValue("");
    setTranslitValue("");
  };

  return (
    <div className="translit-container">
      <div className="input-container">
        <textarea
          value={inputValue}
          onChange={handleInputChange}
          className="translit-input"
          rows="3"
          placeholder="Cyrillic"
        />
        {inputValue && (
          <button onClick={clearInput} className="clear-button">
            Clear
          </button>
        )}
      </div>
      <div className="translit-output">
        <textarea
          value={translitValue}
          readOnly
          className="translit-input"
          rows="3"
          placeholder="Latin"
        />
      </div>
      <button onClick={() => alert(translitValue)} className="share-button">
        Show
      </button>
    </div>
  );
};

export default TranslitPage;
