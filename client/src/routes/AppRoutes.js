import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Homepage from "../pages/Homepage";
import AuthPage from "../pages/AuthPage";
import ProfilePage from "../pages/ProfilePage";
import ProtectedRoute from "./ProtectedRoute";
import RedirectRoute from "./RedirectRoute";
import KeyboardPage from "../pages/KeyboardPage";
import MessagesPage from "../pages/MessagesPage";
import NotFound from "../pages/NotFound";
import WordDetails from "../pages/WordDetails";
import CommentedWords from "../pages/CommentedWords";
import ResetPassword from "../components/ResetPassword/ResetPassword";
import ForgotPassword from "../components/ForgotPassword/ForgotPassword";
import CreatePost from "../pages/CreatePost";
import PostList from "../components/Posts/PostList";
import PostPage from "../pages/PostPage";
import AdminPanel from "../pages/AdminPanel";
import EditUser from "../pages/EditUser";
import UserList from "../pages/UserList";

const AppRoutes = () => {
  const [posts, setPosts] = useState([]);


  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/words" element={<CommentedWords />} />
      <Route path="/keyboard" element={<KeyboardPage />} />
      <Route path="/user-list" element={<UserList />} />
      <Route path="/word/:wordId" element={<WordDetails />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset/:token" element={<ResetPassword />} />
      <Route path="/posts/create" element={<ProtectedRoute element={<CreatePost onPostCreated={handlePostCreated} />} redirectTo="/auth" />} />
      <Route path="/posts" element={<PostList posts={posts} />} />
      <Route path="/posts/:id" element={<PostPage />} /> 
      <Route path="/admin" element={<AdminPanel />} />
      <Route path="/admin/edit-user/:id" element={<EditUser />} />
      <Route path="/messages" element={<ProtectedRoute element={<MessagesPage />} redirectTo="/auth" />} />
      <Route path="/users" element={<ProtectedRoute element={<UserList />} redirectTo="/auth" />} />
      <Route path="/user-profile/:userId" element={<ProfilePage />} />

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
        path="/dashboard"
        element={
          <ProtectedRoute element={<ProfilePage />} redirectTo="/login" />
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
