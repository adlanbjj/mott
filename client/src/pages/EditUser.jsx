import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../public/styles/EditUser.css';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    username: '',
    email: '',
    location: '',
    age: ''
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:3001/auth/admin/users/${id}`, {
          credentials: 'include',
        });
        const data = await response.json();
        if (response.ok) {
          setUser(data);
          setForm({
            username: data.username,
            email: data.email,
            location: data.location || '',
            age: data.age || ''
          });
        } else {
          setError(data.error);
        }
      } catch (error) {
        setError('An error occurred. Please try again later.');
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3001/auth/admin/users/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
        credentials: 'include',
      });

      const data = await response.json();
      if (response.ok) {
        navigate('/admin');
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="edit-user-container">
      <h2>Edit User</h2>
      {error && <div className="error">{error}</div>}
      {user && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={handleChange}
          />
          <input
            type="number"
            name="age"
            value={form.age}
            onChange={handleChange}
          />
          <button type="submit">Update User</button>
        </form>
      )}
    </div>
  );
};

export default EditUser;
