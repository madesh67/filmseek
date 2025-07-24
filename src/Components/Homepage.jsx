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

   const handleMoviesClick = (e) => {
        e.preventDefault();
        navigate('/movies');
    };

  return (
    <div className='homepage'>
      <section className="intro">
        <div className="header">
            <img className="header-logo" src={logo} width={50} height={50} alt="filmseek"></img>
            <h1 className="header-logo-title">FILMSEEK</h1>
            <nav className="nav">
                <a href="#popular-section">Popular Movies</a>
                <a href="#top-rated">Top Rated</a>
                <a href="#upcoming">upcoming</a>
                <a href="/movies">Movies</a>
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
