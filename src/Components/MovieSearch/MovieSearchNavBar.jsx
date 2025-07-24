import React, { useEffect, useState } from 'react';
import '../../styles/MovieSearch/MovieSearchNavBar.css';
import logo from '../../img-sources/video-play.png';

const MovieSearchNavBar = ({onCategoryClick}) => {

  const handleCategoryClick = (category) => {
    onCategoryClick(category);
  };

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
        {/* blank */}
      </div>

    </div>
  );
};

export default MovieSearchNavBar;
