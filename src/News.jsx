import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import SkeletonLoader from './SkeletonLoader'; // Import the SkeletonLoader component
import './News.css';

const News = () => {
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState('general');
  const [loading, setLoading] = useState(false);
  const pageSize = 10; // Set page size to 10
  const API_KEY = 'cf792dab17a8410fa7af2ab77fd49ac6'; // Replace with your API key
  const bottomDivRef = useRef(null);

  const fetchNews = async (searchQuery = '', pageNumber = 1, newsCategory = 'general') => {
    try {
      setLoading(true);
      const url = searchQuery
        ? `https://newsapi.org/v2/everything?q=${searchQuery}&page=${pageNumber}&pageSize=${pageSize}&apiKey=${API_KEY}`
        : `https://newsapi.org/v2/top-headlines?country=us&category=${newsCategory}&page=${pageNumber}&pageSize=${pageSize}&apiKey=${API_KEY}`;
      const response = await axios.get(url);
      setArticles((prevArticles) => [...prevArticles, ...response.data.articles]);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews('', page, category);
  }, [page, category]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setArticles([]); // Clear previous results on new search
      fetchNews(searchTerm, 1, category);
      setPage(1);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPage((prevPage) => prevPage + 1); // Trigger loading more content
        }
      },
      { threshold: 1.0 }
    );

    if (bottomDivRef.current) {
      observer.observe(bottomDivRef.current);
    }

    return () => {
      if (bottomDivRef.current) {
        observer.unobserve(bottomDivRef.current);
      }
    };
  }, []);

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setArticles([]); // Clear articles on category change
    setPage(1); // Reset to page 1
  };

  return (
    <div className="news-container">
      <h1>Latest News</h1>
      <div className="controls">
        <div className="search-bar">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search news..."
          />
        </div>
        <div className="category-select">
          <select value={category} onChange={handleCategoryChange} aria-label="Select news category">
            <option value="general">General</option>
            <option value="business">Business</option>
            <option value="entertainment">Entertainment</option>
            <option value="health">Health</option>
            <option value="science">Science</option>
            <option value="sports">Sports</option>
            <option value="technology">Technology</option>
          </select>
        </div>
      </div>
      {loading ? (
        <SkeletonLoader /> // Use the SkeletonLoader component
      ) : articles.length > 0 ? (
        articles.map((article, index) => (
          <div key={index} className="news-card">
            <h2>{article.title}</h2>
            <p>{article.description}</p>
            <a href={article.url} target="_blank" rel="noopener noreferrer">Read more</a>
          </div>
        ))
      ) : (
        <p>No news found.</p>
      )}
      <div ref={bottomDivRef} style={{ height: '1px', visibility: 'hidden' }}></div>
    </div>
  );
};

export default News;
