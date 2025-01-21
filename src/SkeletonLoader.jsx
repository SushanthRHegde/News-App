import React from 'react';
import './SkeletonLoader.css';

const SkeletonLoader = () => {
  const cardCount = 10; // Set how many skeleton cards to show

  return (
    <div className="skeleton-loader-container">
      {[...Array(cardCount)].map((_, index) => (
        <div key={index} className="skeleton-card">
          <div className="skeleton-title"></div>
          <div className="skeleton-description"></div>
          <div className="skeleton-link"></div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
