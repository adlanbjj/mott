import React, { useEffect, useState } from 'react';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://mott-server-f5c8bc5b637d.herokuapp.com/auth/admin/users', {
          credentials: 'include',
        });
        const data = await response.json();
        if (response.ok) {
          setUsers(data);
        } else {
          setError(data.error);
        }
      } catch (error) {
        setError('An error occurred. Please try again later.');
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    try {
      const response = await fetch(`https://mott-server-f5c8bc5b637d.herokuapp.com/auth/admin/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setUsers(users.filter(user => user._id !== userId));
        setError('');
      } else {
        const data = await response.json();
        setError(data.error);
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
    }
  };

  const handleBlock = async (userId) => {
    try {
      const response = await fetch(`https://mott-server-f5c8bc5b637d.herokuapp.com/auth/admin/users/block/${userId}`, {
        method: 'PATCH',
        credentials: 'include',
      });

      if (response.ok) {
        const updatedUsers = users.map(user => {
          if (user._id === userId) {
            return { ...user, isBlocked: !user.isBlocked };
          }
          return user;
        });
        setUsers(updatedUsers);
        setError('');
      } else {
        const data = await response.json();
        setError(data.error);
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
    }
  };

  const filteredUsers = users.filter(user =>
    user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>
      {error && <div className="error">{error}</div>}
      <input
        type="text"
        placeholder="Search users"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul>
        {filteredUsers.map(user => (
          <li key={user._id}>
            {user.username}
            <button onClick={() => handleDelete(user._id)}>Delete</button>
            <button onClick={() => handleBlock(user._id)}>
              {user.isBlocked ? 'Unblock' : 'Block'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPanel;
