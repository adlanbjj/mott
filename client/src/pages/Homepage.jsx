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
          <p>You need to log in to write a post or leave a comment.</p>
          <Link to='/auth' className='auth-link'>Sign in</Link>
        </div>
      )}
      <PostList />
    </div>
  );
}

export default Homepage;
