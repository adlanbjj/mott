import React, { useState } from "react";

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    location: "",
    age: "",
  });

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
      const response = await fetch('http://localhost:3001/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Registration successful:', data);

    } catch (error) {
      console.log('Problem with registration in client: ' + error.message);
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
          type="email"
          placeholder="Enter your email"
          name="email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Enter your password"
          name="password"
          value={form.password}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Your location"
          name="location"
          value={form.location}
          onChange={handleChange}
        />
        <input
          type="number"
          placeholder="Your age"
          name="age"
          value={form.age}
          onChange={handleChange}
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
