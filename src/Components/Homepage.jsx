import '../styles/homePage.css'
import Homeintro from './homepage/Homeintro';
import logo from '../img-sources/video-play.png'
import PopularSection from './homepage/PopularSection';
import TopRatedSection from './homepage/TopRated';
import UpcomingMoviesSection from './homepage/UpcomingMoviesSection';
import Trending from './homepage/Trending.jsx';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import Explore from './homepage/Explore.jsx';

function Homepage() {

  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
      if (searchQuery.trim() && searchQuery.length > 2) {
        navigate(`/movies?search=${encodeURIComponent(searchQuery.trim())}`);
      }
  };

  const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
        handleSearch();
     }
  };

   const handleMoviesClick = () => {
        navigate('/movies');
    };

    const handleSectionClick = (e, sectionId) => {
        e.preventDefault(); // Prevent default anchor behavior
        scrollToSection(sectionId);
    };

  return (
    <div className='homepage'>
      <section className="intro">
        <div className="header">
            <img className="header-logo" src={logo} width={50} height={50} alt="filmseek"></img>
            <h1 className="header-logo-title">FILMSEEK</h1>
            <nav>
                <ScrollLink to="popular-section" smooth={true} duration={500} className="nav-link">Popular Movies</ScrollLink>
                <a href="#top-rated" onClick={(e) => handleSectionClick(e, 'top-rated')}>Top Rated</a>
                <a href="#upcoming" onClick={(e) => handleSectionClick(e, 'upcoming')}>upcoming</a>
                <a href="#trending" onClick={(e) => handleSectionClick(e, 'trending')}>trending</a>
                <Link to="/movies" className="movies-nav-button">Movies</Link>
            </nav>
            <div className="header-search-bar">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
                    <form className="example">
                    <input type="text" placeholder="Search.." name="search" value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} onKeyPress={handleKeyPress}></input>
                        <button type="submit" onClick={handleSearch} disabled={searchQuery.length<=2}><i className="fa fa-search"></i></button>
                    </form>
            </div>
        </div>
        <Homeintro />
      </section>
      <PopularSection />
      <TopRatedSection />
      <UpcomingMoviesSection />
      <Trending />
      <Explore />
    </div>
  );
}

export default Homepage;
