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
    <p>Enter your email and we'll send you a link to get back into your account.</p>
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit">Send link</button>
    </form>
    {message && <div className="message">{message}</div>}
    {error && <div className="error">{error}</div>}
  </div>
  );
};

export default ForgotPassword;
