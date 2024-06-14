import React from "react";
import { Routes, Route } from "react-router-dom";
import Homepage from "../pages/Homepage";
import AuthPage from "../pages/AuthPage";
import ProfilePage from "../pages/ProfilePage";
import ProtectedRoute from "./ProtectedRoute";
import RedirectRoute from "./RedirectRoute";
import KeyboardPage from "../pages/KeyboardPage";
import TopUsersPage from "../pages/TopUsersPage";
import MessagesPage from "../pages/MessagesPage";
import NotFound from "../pages/NotFound";
import WordDetails from "../pages/WordDetails";
import CommentedWords from "../pages/CommentedWords";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/words" element={<CommentedWords />} />
      <Route path="/keyboard" element={<KeyboardPage />} />
      <Route path="/top-users" element={<TopUsersPage />} />
      <Route path="/word/:wordId" element={<WordDetails />} />
      <Route
        path="/messages"
        element={
          <ProtectedRoute element={<MessagesPage />} redirectTo="/auth" />
        }
      />
      <Route
        path="/auth"
        element={<RedirectRoute element={<AuthPage />} redirectTo="/profile" />}
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute element={<ProfilePage />} redirectTo="/login" />
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
