import React from 'react';
import { useUser } from '../context/userContext';
import { Navigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user, logout } = useUser();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <h1>Welcome {user.username}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default ProfilePage;
