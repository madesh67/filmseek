import React, { useEffect, useState } from 'react';
import '../../styles/MovieSearch/MovieSearchNavBar.css';
import logo from '../../img-sources/video-play.png';

const MovieSearchNavBar = ({onCategoryClick}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleCategoryClick = (category, e) => {
    e.preventDefault();
    onCategoryClick(category);
    setIsMobileMenuOpen(false); // Close mobile menu after selection
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const mobileMenu = document.getElementById('mobileMenu');
      const menuToggle = document.querySelector('.menu-toggle');
      
      if (mobileMenu && menuToggle && 
          !menuToggle.contains(event.target) && 
          !mobileMenu.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="search-navbar">
      <div className="nav-left">
        <a href="/">
          <img src={logo} alt="Logo" className="nav-logo" />
          <h2>FILMSEEK</h2>
        </a>
      </div>

      <div className="nav-middle">
        <div className="dropdown">
          <button className="dropbtn">Movies ▾</button>
          <div className="dropdown-content">
            <a href="#" onClick={(e) => handleCategoryClick('popular', e)}>Popular</a>
            <a href="#" onClick={(e) => handleCategoryClick('top_rated', e)}>Top Rated</a>
            <a href="#" onClick={(e) => handleCategoryClick('upcoming', e)}>Upcoming</a>
            <a href="#" onClick={(e) => handleCategoryClick('now_playing', e)}>Now Playing</a>
          </div>
        </div>

        <div className="dropdown">
          <button className="dropbtn">TV Shows ▾</button>
          <div className="dropdown-content">
            <a href="#" onClick={(e) => handleCategoryClick('tv_popular', e)}>Popular</a>
            <a href="#" onClick={(e) => handleCategoryClick('tv_airing_today', e)}>Airing Today</a>
            <a href="#" onClick={(e) => handleCategoryClick('tv_on_the_air', e)}>On TV</a>
            <a href="#" onClick={(e) => handleCategoryClick('tv_top_rated', e)}>Top Rated</a>
          </div>
        </div>
        
        <div className="nowplaying">
          <a href="#" onClick={(e) => handleCategoryClick('now_playing', e)}>Now Playing</a>
        </div>
      </div>

      <div className="nav-right">
        <button 
          className={`menu-toggle ${isMobileMenuOpen ? 'active' : ''}`} 
          onClick={toggleMobileMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <div 
        className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`} 
        id="mobileMenu"
      >
        <div className="mobile-dropdown">
          <span className="mobile-category-title">Movies</span>
          <a href="#" onClick={(e) => handleCategoryClick('popular', e)}>Popular</a>
          <a href="#" onClick={(e) => handleCategoryClick('top_rated', e)}>Top Rated</a>
          <a href="#" onClick={(e) => handleCategoryClick('upcoming', e)}>Upcoming</a>
          <a href="#" onClick={(e) => handleCategoryClick('now_playing', e)}>Now Playing</a>
        </div>
        
        <div className="mobile-dropdown">
          <span className="mobile-category-title">TV Shows</span>
          <a href="#" onClick={(e) => handleCategoryClick('tv_popular', e)}>Popular</a>
          <a href="#" onClick={(e) => handleCategoryClick('tv_airing_today', e)}>Airing Today</a>
          <a href="#" onClick={(e) => handleCategoryClick('tv_on_the_air', e)}>On TV</a>
          <a href="#" onClick={(e) => handleCategoryClick('tv_top_rated', e)}>Top Rated</a>
        </div>
      </div>
    </div>
  );
};

export default MovieSearchNavBar;
