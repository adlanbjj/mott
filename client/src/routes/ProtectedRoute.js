import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/userContext';

const ProtectedRoute = ({ element, redirectTo }) => {
  const { user } = useUser();
  return user ? element : <Navigate to={redirectTo} />;
};

export default ProtectedRoute;