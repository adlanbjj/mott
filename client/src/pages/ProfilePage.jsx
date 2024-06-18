import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function ProfilePage() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      if (userId) {
        console.log("UserID:", userId);
        try {
          const response = await fetch(`http://localhost:3001/auth/user/${userId}`, {
            credentials: 'include',
          });
          if (response.ok) {
            const data = await response.json();
            setUser(data);
          } else {
            throw new Error('Failed to fetch user');
          }
        } catch (error) {
          console.error('Failed to fetch user:', error);
          setError('Failed to fetch user');
        }
      } else {
        console.error('UserID is undefined');
        setError('UserID is undefined');
      }
    };
    fetchUser();
  }, [userId]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{user.username}'s Profile</h1>
      <p>Age: {user.age}</p>
      <p>Location: {user.location}</p>
    </div>
  );
}

export default ProfilePage;
