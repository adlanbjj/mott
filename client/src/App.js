import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import { UserProvider } from "./context/userContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <div className="App">
          <Header />
          <div className="main-content">
            <Sidebar />
            <div className="page-content">
            <AppRoutes /> 
            </div>
          </div>
        </div>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
