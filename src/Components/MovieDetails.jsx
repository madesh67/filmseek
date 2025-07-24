import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import '../styles/MovieSearch/MovieDetails.css';
import default_movie_poster from '../img-sources/default-movie-poster.png';
import default_backdrop from '../img-sources/default-backdrop.png';

function MovieDetails() {
  const { id, type } = useParams(); // type will be 'movie' or 'tv'
  const navigate = useNavigate();
  const location = useLocation();
  
  const [movieDetails, setMovieDetails] = useState(null);
  const [cast, setCast] = useState([]);
  const [watchProviders, setWatchProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch movie/TV show details
  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch main details
        const detailsRes = await fetch(
          `https://api.themoviedb.org/3/${type}/${id}?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=en-US`
        );
        const detailsData = await detailsRes.json();
        
        // Fetch cast
        const creditsRes = await fetch(
          `https://api.themoviedb.org/3/${type}/${id}/credits?api_key=${import.meta.env.VITE_TMDB_API_KEY}`
        );
        const creditsData = await creditsRes.json();
        
        // Fetch watch providers
        const watchRes = await fetch(
          `https://api.themoviedb.org/3/${type}/${id}/watch/providers?api_key=${import.meta.env.VITE_TMDB_API_KEY}`
        );
        const watchData = await watchRes.json();
        
        setMovieDetails(detailsData);
        setCast(creditsData.cast?.slice(0, 12) || []); // Limit to 12 cast members
        setWatchProviders(watchData.results?.US || watchData.results?.IN || {});
        
      } catch (error) {
        console.error('Error fetching details:', error);
        setError('Failed to load movie details');
      } finally {
        setIsLoading(false);
      }
    };

    if (id && type) {
      fetchDetails();
    }
  }, [id, type]);

  const handleImageError = (e) => {
    e.target.src = default_movie_poster;
  };

  const handleBackdropError = (e) => {
    e.target.src = default_backdrop;
  };

  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatRating = (rating) => {
    return rating ? rating.toFixed(1) : 'N/A';
  };

  if (isLoading) {
    return (
      <div className="movie-details-loading">
        <ClipLoader color="#007bff" loading={isLoading} size={50} />
        <p>Loading movie details...</p>
      </div>
    );
  }

  if (error || !movieDetails) {
    return (
      <div className="movie-details-error">
        <h2>Error</h2>
        <p>{error || 'Movie not found'}</p>
        <button onClick={() => navigate(-1)} className="back-btn">
          Go Back
        </button>
      </div>
    );
  }

const handleBackClick = () => {
  if (location.state?.returnUrl) {
    // Navigate back to the exact filtered URL
    navigate(location.state.returnUrl);
  } else {
    // Fallback: try to go to previous page or default to movies
    if (document.referrer && document.referrer.includes('/movies')) {
      window.location.href = document.referrer;
    } else {
      navigate('/movies');
    }
  }
};

  return (
    <div className="movie-details">
      {/* Movie Banner Background */}
      <div className="movie-banner">
        <div className="banner-backdrop">
          <img
            src={movieDetails.backdrop_path 
              ? `https://image.tmdb.org/t/p/original${movieDetails.backdrop_path}`
              : default_backdrop
            }
            alt={movieDetails.title || movieDetails.name}
            onError={handleBackdropError}
          />
          <div className="banner-overlay"></div>
        </div>
        
        {/* Back Button */}
        <button onClick={handleBackClick} className="back-button">
          ← Back
        </button>

        {/* Main Content */}
        <div className="movie-content">
          {/* Left: Movie Poster */}
          <div className="movie-poster">
            <img
              src={movieDetails.poster_path 
                ? `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`
                : default_movie_poster
              }
              alt={movieDetails.title || movieDetails.name}
              onError={handleImageError}
            />
          </div>

          {/* Middle: Movie Info */}
          <div className="movie-info">
            {/* Title and Rating */}
            <div className="title-section">
              <h1 className="movie-title">
                {movieDetails.title || movieDetails.name}
                <span className="release-year">
                  ({new Date(movieDetails.release_date || movieDetails.first_air_date).getFullYear()})
                </span>
              </h1>
              
              <div className="rating-section">
                <div className="tmdb-rating">
                  <span className="rating-star">⭐</span>
                  <span className="rating-value">{formatRating(movieDetails.vote_average)}</span>
                  <span className="rating-count">({movieDetails.vote_count} votes)</span>
                </div>
              </div>
            </div>

            {/* Movie Meta Info */}
            <div className="movie-meta">
              <div className="meta-item">
                <strong>Release Date:</strong> 
                <span>{new Date(movieDetails.release_date || movieDetails.first_air_date).toLocaleDateString()}</span>
              </div>
              
              <div className="meta-item">
                <strong>Genres:</strong>
                <div className="genres-list">
                  {movieDetails.genres?.map(genre => (
                    <span key={genre.id} className="genre-tag">{genre.name}</span>
                  ))}
                </div>
              </div>
              
              <div className="meta-item">
                <strong>Duration:</strong>
                <span>{formatRuntime(movieDetails.runtime || movieDetails.episode_run_time?.[0])}</span>
              </div>
              
              <div className="meta-item">
                <strong>Original Language:</strong>
                <span>{movieDetails.original_language?.toUpperCase()}</span>
              </div>
              
              <div className="meta-item">
                <strong>Status:</strong>
                <span className="status">{movieDetails.status}</span>
              </div>
            </div>

            {/* Overview */}
            <div className="overview-section">
              <h3>Overview</h3>
              <p className="overview-text">
                {movieDetails.overview || 'No overview available'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Where to Watch Section */}
      {Object.keys(watchProviders).length > 0 && (
        <div className="watch-providers-section">
          <h3>Where to Watch</h3>
          <div className="providers-container">
            {watchProviders.flatrate && (
              <div className="provider-category">
                <h4>Stream</h4>
                <div className="providers-list">
                  {watchProviders.flatrate.map(provider => (
                    <div key={provider.provider_id} className="provider-item">
                      <img
                        src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
                        alt={provider.provider_name}
                        title={provider.provider_name}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {watchProviders.rent && (
              <div className="provider-category">
                <h4>Rent</h4>
                <div className="providers-list">
                  {watchProviders.rent.map(provider => (
                    <div key={provider.provider_id} className="provider-item">
                      <img
                        src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
                        alt={provider.provider_name}
                        title={provider.provider_name}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {watchProviders.buy && (
              <div className="provider-category">
                <h4>Buy</h4>
                <div className="providers-list">
                  {watchProviders.buy.map(provider => (
                    <div key={provider.provider_id} className="provider-item">
                      <img
                        src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
                        alt={provider.provider_name}
                        title={provider.provider_name}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cast Section */}
      {cast.length > 0 && (
        <div className="cast-section">
          <h3>Cast</h3>
          <div className="cast-grid">
            {cast.map(actor => (
              <div key={actor.id} className="cast-member">
                <div className="cast-photo">
                  <img
                    src={actor.profile_path 
                      ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                      : default_movie_poster
                    }
                    alt={actor.name}
                    onError={handleImageError}
                  />
                </div>
                <div className="cast-info">
                  <h4 className="actor-name">{actor.name}</h4>
                  <p className="character-name">{actor.character}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieDetails;