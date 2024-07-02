import React from "react";
import { BrowserRouter } from "react-router-dom";
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
          <div className="header-content">
            <Header />
          </div>
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
