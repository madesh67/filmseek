import '../styles/homePage.css'
import Homeintro from './homepage/Homeintro';
import logo from '../img-sources/video-play.png'
import PopularSection from './homepage/PopularSection';
import TopRatedSection from './homepage/TopRated';
import UpcomingMoviesSection from './homepage/UpcomingMoviesSection';
import Trending from './homepage/Trending.jsx';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import Explore from './homepage/Explore.jsx';
import Breadcrumb from './homepage/Breadcrumb'; // Add this import

function Homepage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeSection, setActiveSection] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const handleSearch = (e) => {
        e.preventDefault(); // Add this to prevent form submission
        if (searchQuery.trim() && searchQuery.length > 2) {
            navigate(`/movies?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch(e);
        }
    };

    const handleMoviesClick = () => {
        navigate('/movies');
    };

    // Track which section is currently in view
    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
        };

        const observerCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        
        // Observe all sections
        const sections = ['popular-section', 'top-rated', 'upcoming', 'trending'];
        sections.forEach(id => {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div className='homepage'>
            {/* Add breadcrumb - it will only show on non-homepage routes */}
            <Breadcrumb />
            
            <section className="intro">
                <div className="header">
                    <Link to="/" className="header-brand">
                        <img className="header-logo" src={logo} width={50} height={50} alt="filmseek"></img>
                        <h1 className="header-logo-title">FILMSEEK</h1>
                    </Link>
                    
                    <nav className="main-navigation">
                        <ScrollLink 
                            to="popular-section" 
                            smooth={true} 
                            duration={300} 
                            className={`nav-link ${activeSection === 'popular-section' ? 'active' : ''}`}
                            spy={true}
                            activeClass="active"
                        >
                            Popular
                        </ScrollLink>
                        
                        <ScrollLink 
                            to="top-rated" 
                            smooth={true} 
                            duration={300} 
                            className={`nav-link ${activeSection === 'top-rated' ? 'active' : ''}`}
                            spy={true}
                            activeClass="active"
                        >
                            Top Rated
                        </ScrollLink>
                        
                        <ScrollLink 
                            to="upcoming" 
                            smooth={true} 
                            duration={300} 
                            className={`nav-link ${activeSection === 'upcoming' ? 'active' : ''}`}
                            spy={true}
                            activeClass="active"
                        >
                            Upcoming
                        </ScrollLink>
                        
                        <ScrollLink 
                            to="trending" 
                            smooth={true} 
                            duration={300} 
                            className={`nav-link ${activeSection === 'trending' ? 'active' : ''}`}
                            spy={true}
                            activeClass="active"
                        >
                            Trending
                        </ScrollLink>
                        
                        <Link to="/movies" className="movies-nav-button">
                            <i className="fa fa-film" aria-hidden="true"></i>
                            Movies
                        </Link>
                    </nav>
                    
                    <div className="header-search-bar">
                        <form className="search-form" onSubmit={handleSearch}>
                            <div className="search-input-group">
                                <input 
                                    type="text" 
                                    placeholder="Search movies, TV shows..." 
                                    name="search" 
                                    value={searchQuery} 
                                    onChange={(e) => setSearchQuery(e.target.value)} 
                                    onKeyPress={handleKeyPress}
                                    className="search-input"
                                    aria-label="Search movies and TV shows"
                                />
                                <button 
                                    type="submit" 
                                    onClick={handleSearch} 
                                    disabled={searchQuery.length <= 2}
                                    className="search-button"
                                    aria-label="Search"
                                >
                                    <i className="fa fa-search"></i>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <Homeintro />
            </section>
            
            {/* Add IDs to sections for scroll spy functionality */}
            <div id="popular-section">
                <PopularSection />
            </div>
            <div id="top-rated">
                <TopRatedSection />
            </div>
            <div id="upcoming">
                <UpcomingMoviesSection />
            </div>
            <div id="trending">
                <Trending />
            </div>
            <Explore />
        </div>
    );
}

export default Homepage;
