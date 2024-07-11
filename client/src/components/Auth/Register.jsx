import React, { useState } from "react";

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    location: "",
    age: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

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
    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email address is invalid";
    } else if (form.email.length > 100) {
      newErrors.email = "Email cannot exceed 100 characters";
    }
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6 || form.password.length > 100) {
      newErrors.password = "Password must be between 6 and 100 characters";
    }
    if (!form.location) {
      newErrors.location = "Location is required";
    } else if (form.location.length > 100) {
      newErrors.location = "Location cannot exceed 100 characters";
    }
    if (!form.age) {
      newErrors.age = "Age is required";
    } else if (isNaN(form.age) || form.age <= 0) {
      newErrors.age = "Age must be a positive number";
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
    setServerError("");

    try {
      const response = await fetch('https://mott-server-f5c8bc5b637d.herokuapp.com/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Server error');
      }

      const data = await response.json();
      console.log('Registration successful:', data);

    } catch (error) {
      console.log('Problem with registration in client: ' + error.message);
      setServerError(error.message);
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
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
          type="email"
          placeholder="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className={errors.email ? "input-error" : ""}
        />
        {errors.email && <p className="error-message">{errors.email}</p>}
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={form.password}
          onChange={handleChange}
          className={errors.password ? "input-error" : ""}
        />
        {errors.password && <p className="error-message">{errors.password}</p>}
        <input
          type="text"
          placeholder="Location"
          name="location"
          value={form.location}
          onChange={handleChange}
          className={errors.location ? "input-error" : ""}
        />
        {errors.location && <p className="error-message">{errors.location}</p>}
        <input
          type="number"
          placeholder="Age"
          name="age"
          value={form.age}
          onChange={handleChange}
          className={errors.age ? "input-error" : ""}
        />
        {errors.age && <p className="error-message">{errors.age}</p>}
        <button type="submit">Register</button>
        {serverError && <p className="error-message server-error">{serverError}</p>}
      </form>
    </div>
  );
};

export default Register;
