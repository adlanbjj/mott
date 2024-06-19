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
          <p>Post yazya ya postan buxaẋ komentari yita <Link to='/auth' className='auth-link'>Çuvala</Link></p>
        </div>
      )}
      <PostList />
    </div>
  );
}

export default Homepage;
