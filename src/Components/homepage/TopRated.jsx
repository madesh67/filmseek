import { useState, useEffect, useRef } from 'react';
import '../../styles/TopRatedSection.css';
import { useNavigate } from 'react-router-dom';

const TopRatedSection = () => {
  const [activeTab, setActiveTab] = useState('movie');
  const [items, setItems] = useState([]);
  const navigate=useNavigate
  const wrapperRef = useRef(null); // useRef for DOM access

  useEffect(() => {
    const fetchTopRated = async () => {
      const type = activeTab;
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/${type}/top_rated?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=en-US&page=1`
        );
        const data = await res.json();
        setItems(data.results.slice(0, 10));
      } catch (err) {
        console.error('Error fetching top-rated data:', err);
      }
    };

    fetchTopRated();
  }, [activeTab]);

  const handleMoreInfo = (movieId, event) => {
        event.stopPropagation(); // Prevent triggering card hover/click
        navigate(`/movie-details/movie/${movieId}`);
  };

  return (
    <section className="top-rated-section" Id="top-rated">
      <p className="top-rated-description">Top-rated Movies and TV shows</p>
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
      <div className="top-ratedContainer">
      <div className="top-rated-list" id="moviesWrapper" ref={wrapperRef}>
        {items.map(item => (
          <div key={item.id} className="top-rated-card">
            <a href={`/movie-details/${activeTab}/${item.id}`}>
            <img
              src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
              alt={item.title || item.name}
            />
            </a>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
};

export default TopRatedSection;
