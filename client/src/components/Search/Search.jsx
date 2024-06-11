import React, { useState, useEffect, useRef } from "react";
import "./Search.css";

const Search = () => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState([]);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const response = await fetch(`http://localhost:3001/words/all`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        const filteredData = data.filter((word) =>
          word.latin.toLowerCase().includes(query.toLowerCase()) ||
          word.cyrillic.toLowerCase().includes(query.toLowerCase()) ||
          word.translation.toLowerCase().includes(query.toLowerCase())
        );
        setResult(filteredData);
      } catch (error) {
        console.error("Error fetching words:", error);
      }
    };

    if (query.length > 0) {
      fetchWords();
    } else {
      setResult([]);
    }
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setQuery("");
        setResult([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="search-container" ref={searchContainerRef}>
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {query && (
        <div className="search-results">
          {result.slice(0, 6).map((word, index) => (
            <div key={index} className="word-item">
              <p><strong>Latin:</strong> {word.latin}</p>
              <p><strong>Cyrillic:</strong> {word.cyrillic}</p>
              <p><strong>Translation:</strong> {word.translation}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
