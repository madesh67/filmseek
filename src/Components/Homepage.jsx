import '../styles/homePage.css'
import Homeintro from './homepage/Homeintro';
import logo from '../img-sources/video-play.png'
import PopularSection from './homepage/PopularSection';
import TopRatedSection from './homepage/TopRated';
import UpcomingMoviesSection from './homepage/UpcomingMoviesSection';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Link } from 'react-router-dom';

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
            <nav className="nav">
                <a href="#popular-section" onClick={(e) => handleSectionClick(e, 'popular-section')}>Popular Movies</a>
                <a href="#top-rated" onClick={(e) => handleSectionClick(e, 'top-rated')}>Top Rated</a>
                <a href="#upcoming" onClick={(e) => handleSectionClick(e, 'upcoming')}>upcoming</a>
                <Link to="/movies" className="movies-nav-button">Movies</Link>
            </nav>
            <div>
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
    </div>
  );
}

export default Homepage;
