import React, { useState } from "react";
import Login from "../components/Auth/Login";
import Register from "../components/Auth/Register";
import "../public/styles/AuthPage.css";

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-block">
          <div className="auth-tabs">
            <div
              className={`tab ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => setActiveTab('login')}
            >
              Çuġo
            </div>
            <div
              className={`tab ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => setActiveTab('register')}
            >
              Qolla akkaunt
            </div>
          </div>
          {activeTab === 'login' ? <Login /> : <Register />}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
