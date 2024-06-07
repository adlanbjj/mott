import React from "react";
import { Routes, Route } from "react-router-dom";
import Homepage from "../pages/Homepage";
import Register from "../components/Auth/Register";
import Login from "../components/Auth/Login";
import AuthPage from "../pages/AuthPage";
import ProfilePage from "../pages/ProfilePage";
import ProtectedRoute from "./ProtectedRoute";
import RedirectRoute from "./RedirectRoute";
import WordsPage from "../pages/WordsPage";
import KeyboardPage from "../pages/KeyboardPage";
import TopUsersPage from "../pages/TopUsersPage";
import MessagesPage from "../pages/MessagesPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/words" element={<WordsPage />} />
      <Route path="/keyboard" element={<KeyboardPage />} />
      <Route path="/top-users" element={<TopUsersPage />} />
      <Route
        path="/messages"
        element={<ProtectedRoute element={<MessagesPage />} redirectTo="/auth" />}
      />
      <Route
        path="/register"
        element={<RedirectRoute element={<Register />} redirectTo="/profile" />}
      />
       <Route
        path="/auth"
        element={<RedirectRoute element={<Register />} redirectTo="/profile" />}
      />
      <Route
        path="/login"
        element={<RedirectRoute element={<Login />} redirectTo="/profile" />}
      />
      <Route path="/auth" element={<AuthPage />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute element={<ProfilePage />} redirectTo="/login" />
        }
      />
    </Routes>
  );
};

export default AppRoutes;
