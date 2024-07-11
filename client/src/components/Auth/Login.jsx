import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from '../../context/userContext';

const Login = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useUser();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.username) {
      newErrors.username = "Username is required";
    } else if (form.username.length > 50) {
      newErrors.username = "Username cannot exceed 50 characters";
    }
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length > 100) {
      newErrors.password = "Password cannot exceed 100 characters";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    setErrors({});
    setError(null);

    try {
      const response = await fetch("https://mott-server-f5c8bc5b637d.herokuapp.com/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (response.ok) {
        login(data.userdata);
        navigate("/");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (error) {
      setError("Problem with login: " + error.message);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="text"
          placeholder="Username"
          name="username"
          value={form.username}
          onChange={handleChange}
          className={errors.username ? "input-error" : ""}
        />
        {errors.username && <p className="error-message">{errors.username}</p>}
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={form.password}
          onChange={handleChange}
          className={errors.password ? "input-error" : ""}
        />
        {errors.password && <p className="error-message">{errors.password}</p>}
        <button type="submit">Login</button>
        {error && <p className="error-message server-error">{error}</p>}
        <div className="forgot-password-link">
          <Link to="/forgot-password">Forgot password?</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
