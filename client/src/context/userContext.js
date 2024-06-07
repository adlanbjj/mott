import React, { createContext, useContext, useEffect, useState } from 'react';
import useAuth from './useAuth';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const auth = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:3001/auth/user", {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          auth.login(data.userdata);
        } else if (response.status === 401) {
          console.log('User is not authorized');
        } else {
          throw new Error('Failed to fetch user');
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [auth]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <UserContext.Provider value={auth}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
