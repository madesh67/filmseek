import { useEffect, useState, useRef, useCallback } from 'react';
import '../../styles/homePage.css';
import { useNavigate } from 'react-router-dom';

export default function Homeintro() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCard, setActiveCard] = useState(0);
    const [items, setItems] = useState([]);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const navigate = useNavigate();
    const intervalRef = useRef(null);
    const timeoutRef = useRef(null);

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
    
    // Advanced auto-rotation function
    const startAutoRotation = useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        
        intervalRef.current = setInterval(() => {
            setActiveCard(prevCard => {
                const nextCard = (prevCard + 1) % Math.min(items.length, 5);
                return nextCard;
            });
        }, 5000);
    }, [items.length]);
    
    // Stop auto-rotation temporarily on user interaction
    const pauseAutoRotation = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        
        // Resume after 10 seconds of no interaction
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            startAutoRotation();
        }, 10000);
    }, [startAutoRotation]);
    
    // Handle manual card selection
    const handleCardHover = useCallback((index) => {
        setActiveCard(index);
        pauseAutoRotation();
    }, [pauseAutoRotation]);
    
    // Fetch movies data
    useEffect(() => {
        const fetchNowPlaying = async () => {
            try {
                const res = await fetch(
                    `https://api.themoviedb.org/3/movie/now_playing?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=en-US&page=1`
                );
                const data = await res.json();
                const movies = data.results;
                
                const filteredByDate = movies.filter(movie => {
                    if (movie.release_date) {
                        return movie.release_date >= '2025-07-01' && movie.vote_count >= 100;
                    }
                    return false;
                });
                
                // Limit to exactly 5 movies
                const limitedMovies = filteredByDate.slice(0, 5);
                setItems(limitedMovies);
                
            } catch (err) {
                console.error('Error fetching Now Playing data:', err);
            }
        };
        
        fetchNowPlaying();
    }, []);
    
    // Start auto-rotation when items are loaded
    useEffect(() => {
        if (items.length > 0 && isAutoPlaying) {
            startAutoRotation();
        }
        
        // Cleanup on unmount
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [items, isAutoPlaying, startAutoRotation]);

    const handleMoreInfo = (movieId, event) => {
        event.stopPropagation(); // Prevent triggering card hover/click
        navigate(`/movie-details/movie/${movieId}`);
    };


    return (
        <section id='intro'>
            <div className="centered-section" id="home">
                <h1>Explore, discover, and track all films and TV shows effortlessly.</h1>
                <div>
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
                    <form className="searchBar">
                        <input 
                            type="text" 
                            placeholder="Search.." 
                            name="search" 
                            value={searchQuery} 
                            onChange={(e) => setSearchQuery(e.target.value)} 
                            onKeyPress={handleKeyPress}
                        />
                        <button 
                            type="submit" 
                            onClick={handleSearch} 
                            disabled={searchQuery.length <= 2}
                        >
                            <i className="fa fa-search"></i>
                        </button>
                    </form>
                </div>
            </div>

            <div className="posters" id="posters">
                {items.map((item, index) => (
                    <div 
                        key={item.id} 
                        className={`poster ${index === activeCard ? 'active' : 'passive'}`}
                        onMouseEnter={() => handleCardHover(index)}
                        onMouseLeave={() => {
                            // Resume auto-rotation after mouse leaves
                            if (timeoutRef.current) clearTimeout(timeoutRef.current);
                            timeoutRef.current = setTimeout(() => {
                                startAutoRotation();
                            }, 2000);
                        }}
                        onClick={() => handleCardHover(index)}
                    >
                        <img
                            src={`https://image.tmdb.org/t/p/w500${item.backdrop_path}`} 
                            className="poster-img" 
                            alt={item.title || item.name}
                        />
                        <div className="posterDetail">
                            <div className="posterInfo">
                                <h1 className="poster-title">{item.title}</h1>
                                <h2>Released On : {item.release_date}</h2>
                                <h2>Rating : ⭐{(item.vote_average).toFixed(1)}</h2>
                            </div>
                            <button className="moreInfo" onClick={(e) => handleMoreInfo(item.id, e)}>More Info</button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
