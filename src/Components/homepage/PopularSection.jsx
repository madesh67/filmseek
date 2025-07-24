import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/PopularSection.css';

const PopularSection = () => {
  const [activeTab, setActiveTab] = useState('movie');
  const [items, setItems] = useState([]);
  const navigate=useNavigate();
  const wrapperRef = useRef(null); // useRef for DOM access

  useEffect(() => {
    const fetchPopular = async () => {
      const type = activeTab;
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/${type}/popular?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=en-US&page=1`
        );
        const data = await res.json();
        setItems(data.results.slice(0, 10));
      } catch (err) {
        console.error('Error fetching popular data:', err);
      }
    };

    fetchPopular();
  }, [activeTab]);

  const handleMoreInfo = (movieId, event) => {
        event.stopPropagation(); // Prevent triggering card hover/click
        navigate(`/movie-details/movie/${movieId}`);
  };


  return (
    <section className="popular-section" id="popular-section">
      <p className="popular-description">Popular movies and TV Shows</p>
      <div className="tab-buttons">
        <button
          className={activeTab === 'movie' ? 'active' : ''}
          onClick={() => setActiveTab('movie')}
        >
          Movies
        </button>
        <button
          className={activeTab === 'tv' ? 'active' : ''}
          onClick={() => setActiveTab('tv')}
        >
          TV Shows
        </button>
      </div>
      <div className="PopularContainer">
      <div className="popular-list" id="moviesWrapper" ref={wrapperRef}>
        {items.map(item => (
          <div key={item.id} className="popular-card">
            <img
              src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
              alt={item.title || item.name}
            />
          </div>
        ))}
      </div>
      </div>
    </section>
  );
};

export default PopularSection;