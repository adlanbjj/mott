import React, { useState } from "react";
import '../ForgotPassword/ForgotPassword.css'


const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://mott-server-f5c8bc5b637d.herokuapp.com/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setError("");
      } else {
        setError(data.error);
        setMessage("");
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
      setMessage("");
    }
  };

  return (
    <div className="forgot-password-container">
    <h2>Parol qossa</h2>
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Djayazde ẋayn elektronan poştan adres"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit">Parol qossa</button>
    </form>
    {message && <div className="message">{message}</div>}
    {error && <div className="error">{error}</div>}
  </div>
  );
};

export default ForgotPassword;
