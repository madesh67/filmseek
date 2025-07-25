import { useState, useEffect, useRef } from 'react';
import '../../styles/UpcomingMoviesSection.css';
import { useNavigate } from 'react-router-dom';

const UpcomingMoviesSection = () => {
  const [activeTab, setActiveTab] = useState('movie');
  const [items, setItems] = useState([]);
  const navigate=useNavigate
  const wrapperRef = useRef(null); // useRef for DOM access

  useEffect(() => {
    const fetchUpcomingMovies = async () => {
      const type = activeTab;
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/${type}/upcoming?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=en-US&page=1`
        );
        const data = await res.json();
        setItems(data.results.slice(0, 10));
      } catch (err) {
        console.error('Error fetching upcoming data:', err);
      }
    };

    fetchUpcomingMovies();
  }, [activeTab]);

  const handleMoreInfo = (movieId, event) => {
        event.stopPropagation(); // Prevent triggering card hover/click
        navigate(`/movie-details/movie/${movieId}`);
  };

  return (
    <section className="upcoming-section" Id="upcoming">
      <p className="upcoming-description">Upcoming Movies</p>
      <div className="tab-buttons">
      </div>
      <div className="upcomingContainer">
      <div className="upcoming-list" id="moviesWrapper" ref={wrapperRef}>
        {items.map(item => (
          <div key={item.id} className="upcoming-card">
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

export default UpcomingMoviesSection;
