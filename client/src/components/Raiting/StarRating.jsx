import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import './StarRaiting.css'; 

const StarRating = ({ likeCount }) => {
  const maxStars = 5;
  const filledStars = Math.min(maxStars, Math.floor((likeCount || 0) / 1));
  const stars = [];

  for (let i = 0; i < maxStars; i++) {
    if (i < filledStars) {
      stars.push(<FontAwesomeIcon key={i} icon={solidStar} className="star filled" />);
    } else {
      stars.push(<FontAwesomeIcon key={i} icon={solidStar} className="star" />);
    }
  }

  return <div className="star-rating">{stars}</div>;
};

export default StarRating;
