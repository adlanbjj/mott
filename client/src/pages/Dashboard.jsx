import React, { useState } from "react";
import { useUser } from "../context/userContext";
import "../public/styles/Dashboard.css";

function Dashboard() {
  const { user, login } = useUser();
  const [formData, setFormData] = useState({
    email: user ? user.email : '',
    location: user ? user.location : '',
    age: user ? user.age : '',
    password: '',
    avatar: null
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "avatar") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        avatar: files[0]
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value
      }));
    }
  };

  const handleUpdate = async () => {
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        data.append(key, formData[key]);
      }
    });

    try {
      const response = await fetch("https://mott-server-f5c8bc5b637d.herokuapp.com/auth/current", {
        method: "PATCH",
        credentials: "include",
        body: data,
      });

      if (response.ok) {
        const updatedUser = await response.json();
        login(updatedUser);
        setMessage("Profile updated successfully");
        setFormData((prevFormData) => ({
          ...prevFormData,
          password: '',
          avatar: null
        }));
      } else {
        const errorData = await response.json();
        console.error("Server Error:", errorData);
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      console.error("Client Error:", error.message);
      setMessage(error.message);
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      {message && <p className="message">{message}</p>}
      <div className="form-group">
        {user && user.avatar && (
          <img src={`https://mott-server-f5c8bc5b637d.herokuapp.com${user.avatar}`} alt="User Avatar" className="user-avatar" />
        )}
        <label>Username: {user && user.username}</label>
      </div>
      <div className="form-group">
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>Location:</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>Age:</label>
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>New Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>Avatar:</label>
        <input
          type="file"
          name="avatar"
          onChange={handleChange}
        />
      </div>
      <button onClick={handleUpdate} className="update-button">
        Update Profile
      </button>
    </div>
  );
}

export default Dashboard;
