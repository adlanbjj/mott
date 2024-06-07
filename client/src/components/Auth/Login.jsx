import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useUser } from '../../context/userContext';


const Login = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",  
  });
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/auth/login", {
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
        navigate("/profile");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (error) {
      setError("Problem with login: " + error.message);
    }
  };

  
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your username"
          name="username"
          value={form.username}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Enter your password"
          name="password"
          value={form.password}
          onChange={handleChange}
        />
        <button type="submit">Login</button>
      </form>
      <Link to="/register" className="header-link">
        Register
      </Link>
    </div>
  );
};

export default Login;
