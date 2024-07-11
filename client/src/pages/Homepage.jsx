import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/userContext';
import PostList from '../components/Posts/PostList';
import '../public/styles/Homepage.css';

const Homepage = () => {
  const { user } = useUser();

  return (
    <div className='homepage-container'>
      {!user && (
        <div className='auth-message'>
          <p>To write a post or comment, log in to your account <Link to='/auth' className='auth-link'>Sign in</Link></p>
        </div>
      )}
      <PostList />
    </div>
  );
}

export default Homepage;
