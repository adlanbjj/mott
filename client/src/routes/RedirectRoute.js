import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/userContext';

const RedirectRoute = ({ element, redirectTo }) => {
  const { user } = useUser();
  return user ? <Navigate to={redirectTo} /> : element;
};

export default RedirectRoute;
