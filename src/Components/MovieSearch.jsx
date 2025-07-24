import { useState, useEffect, useLayoutEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import '../styles/MovieSearch/main.css';
import MovieSearchNavBar from './MovieSearch/MovieSearchNavBar';
import FilterMovies from './FilterMovies';
import default_movie_poster from '../img-sources/default-movie-poster.png';
import PageNav from './MovieSearch/PageNav';

function Movie() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentCategory, setCurrentCategory] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [originalSearchResults, setOriginalSearchResults] = useState([]);
  const [currentSearchQuery, setCurrentSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isFilterMode, setIsFilterMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Update the handleMovieClick function
  const handleMovieClick = (item) => {
    const currentUrl = `${location.pathname}${location.search}`;
    navigate(`/movie-details/${item.media_type}/${item.id}`, {
      state: { 
        returnUrl: currentUrl
      }
    });
  };

  // Search-related methods
  const searchMovies = async (searchTerm, page = 1, contentTypeFilter = 'all') => {
    if (!searchTerm || searchTerm.length <= 2) {
      setResults([]);
      setIsSearchMode(false);
      setOriginalSearchResults([]);
      setCurrentSearchQuery('');
      setTotalPages(1);
      setCurrentPage(1);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    setCurrentCategory('');
    
    try {
      let combinedResults = [];
      let maxTotalPages = 1;
      
      if (contentTypeFilter === 'all' || contentTypeFilter === 'movies') {
        const movieRes = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=en-US&query=${searchTerm}&page=${page}`
        );
        const movieData = await movieRes.json();
        
        if (movieData.results) {
          combinedResults.push(...movieData.results.map(item => ({ ...item, media_type: 'movie' })));
          maxTotalPages = Math.max(maxTotalPages, movieData.total_pages || 1);
        }
      }
      
      if (contentTypeFilter === 'all' || contentTypeFilter === 'tv') {
        const tvRes = await fetch(
          `https://api.themoviedb.org/3/search/tv?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=en-US&query=${searchTerm}&page=${page}`
        );
        const tvData = await tvRes.json();
        
        if (tvData.results) {
          combinedResults.push(...tvData.results.map(item => ({ ...item, media_type: 'tv' })));
          maxTotalPages = Math.max(maxTotalPages, tvData.total_pages || 1);
        }
      }
      
      setResults(combinedResults);
      setOriginalSearchResults(combinedResults);
      setCurrentSearchQuery(searchTerm);
      setIsSearchMode(true);
      setTotalPages(Math.min(maxTotalPages, 500));
      setCurrentPage(page);
      
    } catch (error) {
      console.error("Search failed", error);
      setResults([]);
      setTotalPages(1);
      setCurrentPage(1);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMoviesByCategory = async (category, page = 1) => {
    setIsLoading(true);
    setHasSearched(true);
    setCurrentCategory(category);
    setIsSearchMode(false);
    setIsFilterMode(false);
    setOriginalSearchResults([]);
    setCurrentSearchQuery('');
    setQuery('');
    
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${category}?api_key=${import.meta.env.VITE_TMDB_API_KEY}&page=${page}`
      );
      const data = await res.json();
      
      const categoryResults = data.results.map(item => ({ 
        ...item, 
        media_type: 'movie'
      }));
      
      setResults(categoryResults);
      setTotalPages(Math.min(data.total_pages || 1, 500));
      setCurrentPage(page);
      
    } catch (error) {
      console.error("Category fetch failed", error);
      setResults([]);
      setTotalPages(1);
      setCurrentPage(1);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTVShowsByCategory = async (apiCategory, displayCategory, page = 1) => {
    setIsLoading(true);
    setHasSearched(true);
    setCurrentCategory(displayCategory || `tv_${apiCategory}`);
    setQuery('');
    setIsSearchMode(false);
    setIsFilterMode(false);
    setOriginalSearchResults([]);
    setCurrentSearchQuery('');
    
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/tv/${apiCategory}?api_key=${import.meta.env.VITE_TMDB_API_KEY}&page=${page}`
      );
      const data = await res.json();
      
      const categoryResults = data.results.map(item => ({ 
        ...item, 
        media_type: 'tv'
      }));
      
      setResults(categoryResults);
      setTotalPages(Math.min(data.total_pages || 1, 500));
      setCurrentPage(page);
      
    } catch (error) {
      console.error("TV Category fetch failed", error);
      setResults([]);
      setTotalPages(1);
      setCurrentPage(1);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCombinedNowPlaying = async (page = 1) => {
    setIsLoading(true);
    setHasSearched(true);
    setCurrentCategory('now_playing_combined');
    setIsSearchMode(false);
    setIsFilterMode(false);
    setOriginalSearchResults([]);
    setCurrentSearchQuery('');
    
    try {
      const movieRes = await fetch(
        `https://api.themoviedb.org/3/movie/now_playing?api_key=${import.meta.env.VITE_TMDB_API_KEY}&page=${page}`
      );
      const movieData = await movieRes.json();
      
      const tvRes = await fetch(
        `https://api.themoviedb.org/3/tv/airing_today?api_key=${import.meta.env.VITE_TMDB_API_KEY}&page=${page}`
      );
      const tvData = await tvRes.json();
      
      const combinedResults = [
        ...movieData.results.map(item => ({ ...item, media_type: 'movie' })),
        ...tvData.results.map(item => ({ ...item, media_type: 'tv' }))
      ];
      
      setResults(combinedResults);
      setTotalPages(Math.min(Math.max(movieData.total_pages || 1, tvData.total_pages || 1), 500));
      setCurrentPage(page);
      
    } catch (error) {
      console.error("Combined Now Playing fetch failed", error);
      setResults([]);
      setTotalPages(1);
      setCurrentPage(1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    setSearchParams({ category: category });
    
    if (category === 'now_playing') {
      fetchCombinedNowPlaying(1);
    } else if (category.startsWith('tv_')) {
      const tvCategory = category.replace('tv_', '');
      fetchTVShowsByCategory(tvCategory, category, 1);
    } else {
      fetchMoviesByCategory(category, 1);
    }
  };

  const handleSearchClick = () => {
    if (query.trim()) {
      setSearchParams({ search: query.trim() });
      searchMovies(query.trim(), 1, 'all');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      setSearchParams({ search: query.trim() });
      searchMovies(query.trim(), 1, 'all');
    }
  };

  const handleImageError = (e) => {
    e.target.src = default_movie_poster;
  };

  const getCategoryTitle = (category) => {
    const categoryTitles = {
      'movies_all': 'All Movies',
      'movies_popular': 'Popular Movies',
      'movies_top_rated': 'Top Rated Movies',
      'movies_upcoming': 'Upcoming Movies',
      'movies_now_playing': 'Now Playing Movies',
      'tv_all': 'All TV Shows',
      'tv_popular': 'Popular TV Shows',
      'tv_top_rated': 'Top Rated TV Shows',
      'tv_airing_today': 'Airing Today',
      'tv_on_the_air': 'On TV Shows',
      'all_all': 'All Movies & TV Shows',
      'all_popular': 'Popular Movies & TV Shows',
      'all_top_rated': 'Top Rated Movies & TV Shows',
      'all_upcoming': 'Upcoming Movies & On Air TV Shows',
      'all_now_playing': 'Now Playing Movies & Airing Today TV Shows',
      'popular': 'Popular Movies',
      'top_rated': 'Top Rated Movies',
      'upcoming': 'Upcoming Movies',
      'now_playing': 'Now Playing Movies',
      'tv_popular': 'Popular TV Shows',
      'tv_airing_today': 'Airing Today TV Shows',
      'tv_on_the_air': 'On TV Shows',
      'now_playing_combined': 'Now Playing - Movies & TV Shows'
    };
    return categoryTitles[category] || 'Movies & TV Shows';
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      const searchParam = searchParams.get('search');
      const contentTypeParam = searchParams.get('contentType');
      const categoryParam = searchParams.get('category');
      
      if (searchParam) {
        // Search pagination with content type filtering
        const contentTypeForAPI = contentTypeParam || 'all';
        setSearchParams({ 
          search: searchParam, 
          page: newPage,
          ...(contentTypeParam && { contentType: contentTypeParam })
        });
        searchMovies(searchParam, newPage, contentTypeForAPI);
      } else if (categoryParam && !contentTypeParam) {
        // Navigation-based pagination (navbar categories)
        setSearchParams({ category: categoryParam, page: newPage });
        
        if (categoryParam === 'now_playing') {
          fetchCombinedNowPlaying(newPage);
        } else if (categoryParam.startsWith('tv_')) {
          const tvCategory = categoryParam.replace('tv_', '');
          fetchTVShowsByCategory(tvCategory, categoryParam, newPage);
        } else {
          fetchMoviesByCategory(categoryParam, newPage);
        }
      } else if (isFilterMode) {
        // Filter-based pagination - just update page state
        setCurrentPage(newPage);
      }
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle URL parameters for navigation-based searches only
  useLayoutEffect(() => {
    const searchParam = searchParams.get('search');
    const categoryParam = searchParams.get('category');
    const contentTypeParam = searchParams.get('contentType');
    const pageParam = parseInt(searchParams.get('page')) || 1;
    
    if (searchParam) {
      setQuery(searchParam);
      searchMovies(searchParam, pageParam);
    } else if (categoryParam && contentTypeParam) {
      // This is a filter-based URL - let FilterMovies handle it
      setIsFilterMode(true);
      // FilterMovies will handle this via its own useEffect
    } else if (categoryParam && !contentTypeParam) {
      // This is navigation-based
      setIsFilterMode(false);
      if (categoryParam === 'now_playing') {
        fetchCombinedNowPlaying(pageParam);
      } else if (categoryParam.startsWith('tv_')) {
        const tvCategory = categoryParam.replace('tv_', '');
        fetchTVShowsByCategory(tvCategory, categoryParam, pageParam);
      } else {
        fetchMoviesByCategory(categoryParam, pageParam);
      }
    }
  }, [searchParams]);

    useEffect(() => {
      // Clear any conflicting navigation state when component mounts
      window.history.replaceState(null, '', location.pathname + location.search);
    }, [location.pathname, location.search]);

    useEffect(() => {
    const contentTypeParam = searchParams.get('contentType');
    const categoryParam = searchParams.get('category');
    
    // If URL has filter parameters but no results are loaded, trigger filter restoration
    if (contentTypeParam && categoryParam && !hasSearched && results.length === 0) {
      // Let FilterMovies handle the restoration
      setIsFilterMode(true);
    }
  }, [searchParams, hasSearched, results.length]);

  useEffect(() => {
    const contentTypeParam = searchParams.get('contentType');
    const categoryParam = searchParams.get('category');
    
    // If URL has filter parameters, ensure we're in filter mode
    if (contentTypeParam && categoryParam) {
      setIsFilterMode(true);
      setIsSearchMode(false);
      setCurrentSearchQuery('');
      console.log('🎯 Detected filter URL, enabling filter mode');
    }
  }, [searchParams]);

  return (
    <div>
      <MovieSearchNavBar onCategoryClick={handleCategoryClick} />
      <div className="search-page">
        <h2 className="search-heading">
          {currentCategory ? getCategoryTitle(currentCategory) : 'Search Movies and TV Shows'}
        </h2>
        
        <div className="search-container">
          <input
            className="search-input"
            type="text"
            placeholder="Search for movies and tv shows..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button 
            className="search-button"
            onClick={handleSearchClick}
            disabled={query.length <= 2}
          >
            Search
          </button>
        </div>

        <div className="search-layout">
          {/* Left: Filters - All logic is now in FilterMovies component */}
          <FilterMovies
            setResults={setResults}
            setIsLoading={setIsLoading}
            setHasSearched={setHasSearched}
            setCurrentCategory={setCurrentCategory}
            setQuery={setQuery}
            searchParams={searchParams}
            setSearchParams={setSearchParams}
            currentSearchQuery={currentSearchQuery}
            originalSearchResults={originalSearchResults}
            isSearchMode={isSearchMode}
            setIsSearchMode={setIsSearchMode}
            setCurrentSearchQuery={setCurrentSearchQuery}
            setOriginalSearchResults={setOriginalSearchResults}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            setTotalPages={setTotalPages}
            searchMovies={searchMovies}
            setIsFilterMode={setIsFilterMode}
            hasSearched={hasSearched}
            results={results}
          />

          {/* Right: Results */}
          <div className="search-results">
            {isLoading ? (
              <div className="loading-container">
                <ClipLoader color="#007bff" loading={isLoading} size={50} />
                <p>Loading content...</p>
              </div>
            ) : hasSearched && results.length === 0 ? (
              <div className="not-found-container">
                <h3>No Results Found</h3>
                <p>
                  {isSearchMode 
                    ? `No movies or TV shows found for "${currentSearchQuery}" on page ${currentPage}.`
                    : currentCategory 
                      ? `No content found for ${getCategoryTitle(currentCategory)} on page ${currentPage}.`
                      : 'No content found matching your criteria.'
                  }
                </p>
                {currentPage > 1 && (
                  <button 
                    className="back-to-first-btn"
                    onClick={() => handlePageChange(1)}
                  >
                    Go Back to First Page
                  </button>
                )}
              </div>
            ) : (
              results.map((item) => (
                <div 
                  className="movie-card" 
                  key={`${item.media_type}-${item.id}`}
                  onClick={() => handleMovieClick(item)}
                  style={{ cursor: 'pointer' }}
                >
                  <img
                    src={item.poster_path 
                      ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
                      : default_movie_poster
                    }
                    alt={item.title || item.name}
                    onError={handleImageError}
                  />
                  <h3 title={item.title || item.name}>{item.title || item.name}</h3>
                  <p>{item.release_date || item.first_air_date}</p>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* PageNav - Only show for search and navigation, not filters */}
        {hasSearched && results.length > 0 && totalPages > 1 && !isFilterMode && (
          <PageNav
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}

export default Movie;
