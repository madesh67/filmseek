import React, { useState, useEffect } from 'react';
import { BeatLoader } from 'react-spinners';
import PageNav from './MovieSearch/PageNav';

function FilterMovies({
  // Main component communication
  setResults,
  setIsLoading,
  setHasSearched,
  setCurrentCategory,
  setQuery,
  searchParams,
  setSearchParams,
  currentSearchQuery,
  originalSearchResults,
  isSearchMode,
  setIsSearchMode,
  setCurrentSearchQuery,
  setOriginalSearchResults,
  currentPage,
  setCurrentPage,
  totalPages,
  setTotalPages,
  searchMovies,
  hasSearched,
  setIsFilterMode,
  results,
}) {
  // All filter states
  const [selectedContentType, setSelectedContentType] = useState('all');
  const [selectedMovieCategory, setSelectedMovieCategory] = useState('');
  const [selectedTVCategory, setSelectedTVCategory] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [languages, setLanguages] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedRuntime, setSelectedRuntime] = useState(0);
  const [genres, setGenres] = useState([]);
  const [isGenresLoading, setIsGenresLoading] = useState(true);
  const [selectedSortBy, setSelectedSortBy] = useState('popularity.desc');
  const [isRestoringFromUrl, setIsRestoringFromUrl] = useState(false);

  // Filter methods
  const handleGenreChange = (genreId) => {
    setSelectedGenres(prev => 
      prev.includes(genreId) 
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId]
    );
  };

  const clearAllFilters = () => {
    setSelectedGenres([]);
    setSelectedLanguage('');
    setFromDate('');
    setToDate('');
    setSelectedRating(0);
    setSelectedRuntime(0);
    setSelectedContentType('all');
    setSelectedMovieCategory('');
    setSelectedTVCategory('');
    setSelectedSortBy('popularity.desc');
    setIsSearchMode(false);
    setCurrentSearchQuery('');
    setOriginalSearchResults([]);
    setResults([]);
    setSearchParams({});
    localStorage.removeItem('movieFilterBackup');
  };

  const fetchByContentTypeAndCategory = async (contentType, category, page = 1) => {
    setIsLoading(true);
    setHasSearched(true);
    setQuery('');
    setIsFilterMode(true);
    
    try {
      let results = [];
      let totalPagesCount = 1;
      
      const buildDiscoverUrl = (baseEndpoint) => {
        const today = new Date().toISOString().split('T')[0];
        let url = `https://api.themoviedb.org/3/discover/${baseEndpoint}?api_key=${import.meta.env.VITE_TMDB_API_KEY}&page=${page}`;
        
        // Use current state values (which should be restored from URL by now)
        if (selectedSortBy && selectedSortBy !== 'popularity.desc') {
          url += `&sort_by=${selectedSortBy}`;
        }
        
        if (selectedGenres.length > 0) {
          url += `&with_genres=${selectedGenres.join(',')}`;
        }
        
        if (selectedLanguage) {
          url += `&with_original_language=${selectedLanguage}`;
        }
        
        if (selectedRating > 0) {
          url += `&vote_average.gte=${selectedRating}`;
        }
        
        if (selectedRuntime > 0) {
          url += `&with_runtime.gte=${selectedRuntime}`;
        }
        
        if (fromDate || toDate) {
          const dateField = baseEndpoint === 'movie' ? 'primary_release_date' : 'first_air_date';
          if (fromDate) url += `&${dateField}.gte=${fromDate}`;
          if (toDate) url += `&${dateField}.lte=${toDate}`;
        }
        
        // Add category-specific parameters
        if (baseEndpoint === 'movie') {
          if (category === 'top_rated') {
            url += '&vote_count.gte=100';
            if (!selectedSortBy || selectedSortBy === 'popularity.desc') {
              url += '&sort_by=vote_average.desc';
            }
          } else if (category === 'upcoming') {
            url += `&primary_release_date.gte=${today}`;
          } else if (category === 'now_playing') {
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
            const oneMonthAgoStr = oneMonthAgo.toISOString().split('T')[0];
            url += `&primary_release_date.gte=${oneMonthAgoStr}&primary_release_date.lte=${today}`;
          } else if (category === 'popular' || category === 'all') {
            if (!selectedSortBy || selectedSortBy === 'popularity.desc') {
              url += '&sort_by=popularity.desc';
            }
          }
        } else if (baseEndpoint === 'tv') {
          if (category === 'top_rated') {
            url += '&vote_count.gte=100';
            if (!selectedSortBy || selectedSortBy === 'popularity.desc') {
              url += '&sort_by=vote_average.desc';
            }
          } else if (category === 'airing_today') {
            url += `&air_date.gte=${today}&air_date.lte=${today}`;
          } else if (category === 'on_the_air') {
            url += `&air_date.lte=${today}&first_air_date.lte=${today}`;
          } else if (category === 'popular' || category === 'all') {
            if (!selectedSortBy || selectedSortBy === 'popularity.desc') {
              url += '&sort_by=popularity.desc';
            }
          }
        }
        
        console.log('🔗 Final API URL:', url);
        return url;
      };
      
      if (contentType === 'movies') {
        const apiUrl = buildDiscoverUrl('movie');
        const res = await fetch(apiUrl);
        const data = await res.json();
        results = data.results.map(item => ({ ...item, media_type: 'movie' }));
        totalPagesCount = Math.min(data.total_pages || 1, 500);
        setCurrentCategory(`movies_${category}`);
      }
      else if (contentType === 'tv') {
        const apiUrl = buildDiscoverUrl('tv');
        const res = await fetch(apiUrl);
        const data = await res.json();
        results = data.results.map(item => ({ ...item, media_type: 'tv' }));
        totalPagesCount = Math.min(data.total_pages || 1, 500);
        setCurrentCategory(`tv_${category}`);
      }
      else if (contentType === 'all') {
        const [movieRes, tvRes] = await Promise.all([
          fetch(buildDiscoverUrl('movie')),
          fetch(buildDiscoverUrl('tv'))
        ]);
        
        const [movieData, tvData] = await Promise.all([movieRes.json(), tvRes.json()]);
        
        results = [
          ...movieData.results.map(item => ({ ...item, media_type: 'movie' })),
          ...tvData.results.map(item => ({ ...item, media_type: 'tv' }))
        ];
        totalPagesCount = Math.min(Math.max(movieData.total_pages || 1, tvData.total_pages || 1), 500);
        setCurrentCategory(`all_${category}`);
      }
      
      setResults(results);
      setTotalPages(totalPagesCount);
      setCurrentPage(page);
      
    } catch (error) {
      console.error("Discover API fetch failed", error);
      setResults([]);
      setTotalPages(1);
      setCurrentPage(1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterApply = () => {
    const pageToFetch = 1;
    setCurrentPage(1);
    
    if (isSearchMode && currentSearchQuery) {
      let contentTypeForAPI = 'all';
      if (selectedContentType === 'movies') {
        contentTypeForAPI = 'movies';
      } else if (selectedContentType === 'tv') {
        contentTypeForAPI = 'tv';
      }
      
      searchMovies(currentSearchQuery, pageToFetch, contentTypeForAPI);
      
      const urlParams = { search: currentSearchQuery, page: pageToFetch };
      if (selectedContentType !== 'all') urlParams.contentType = selectedContentType;
      setSearchParams(urlParams);
      return;
    }

    // Build URL parameters for all filter types
    const buildUrlParams = (contentType, category) => {
      const urlParams = {
        contentType: contentType,
        category: category,
        page: pageToFetch
      };
      
      if (selectedLanguage) urlParams.language = selectedLanguage;
      if (selectedGenres.length > 0) urlParams.genres = selectedGenres.join(',');
      if (selectedRating > 0) urlParams.rating = selectedRating;
      if (fromDate) urlParams.fromDate = fromDate;
      if (toDate) urlParams.toDate = toDate;
      if (selectedRuntime > 0) urlParams.runtime = selectedRuntime;
      if (selectedSortBy !== 'popularity.desc') urlParams.sort = selectedSortBy;
      
      return urlParams;
    };

    if (selectedContentType === 'movies' && selectedMovieCategory) {
      const urlParams = buildUrlParams(selectedContentType, selectedMovieCategory);
      setSearchParams(urlParams);
      fetchByContentTypeAndCategory('movies', selectedMovieCategory, pageToFetch);
    }
    else if (selectedContentType === 'tv' && selectedTVCategory) {
      const urlParams = buildUrlParams(selectedContentType, selectedTVCategory);
      setSearchParams(urlParams);
      fetchByContentTypeAndCategory('tv', selectedTVCategory, pageToFetch);
    }
    else if (selectedContentType === 'all' && (selectedMovieCategory || selectedTVCategory)) {
      const category = selectedMovieCategory || selectedTVCategory;
      const urlParams = buildUrlParams(selectedContentType, category);
      setSearchParams(urlParams);
      fetchByContentTypeAndCategory('all', category, pageToFetch);
    }
  };

  const handleFilterPageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      let contentType = selectedContentType;
      let category = '';
      
      if (selectedContentType === 'movies' && selectedMovieCategory) {
        category = selectedMovieCategory;
      } else if (selectedContentType === 'tv' && selectedTVCategory) {
        category = selectedTVCategory;
      } else if (selectedContentType === 'all') {
        category = selectedMovieCategory || selectedTVCategory || 'popular';
      }
      
      if (contentType && category) {
        fetchByContentTypeAndCategory(contentType, category, newPage);
        
        const urlParams = {
          contentType: contentType,
          category: category,
          page: newPage
        };
        
        if (selectedLanguage) urlParams.language = selectedLanguage;
        if (selectedGenres.length > 0) urlParams.genres = selectedGenres.join(',');
        if (selectedRating > 0) urlParams.rating = selectedRating;
        if (fromDate) urlParams.fromDate = fromDate;
        if (toDate) urlParams.toDate = toDate;
        if (selectedRuntime > 0) urlParams.runtime = selectedRuntime;
        if (selectedSortBy !== 'popularity.desc') urlParams.sort = selectedSortBy;
        
        setSearchParams(urlParams);
      }
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getFilterButtonText = () => {
    if (isSearchMode) {
      return `Filter "${currentSearchQuery}" Results`;
    }
    return 'Apply Filter';
  };

  const isFilterButtonDisabled = () => {
    if (isSearchMode) {
      return false;
    }
    
    return !selectedLanguage && (
      (selectedContentType === 'movies' && !selectedMovieCategory) ||
      (selectedContentType === 'tv' && !selectedTVCategory) ||
      (selectedContentType === 'all' && !selectedMovieCategory && !selectedTVCategory)
    );
  };

  // Load genres and languages on component mount
  useEffect(() => {
    setIsGenresLoading(true);
    fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${import.meta.env.VITE_TMDB_API_KEY}&language=en-US`)
      .then(res => res.json())
      .then(data => {
        setGenres(data.genres);
        setIsGenresLoading(false);
      })
      .catch(err => {
        console.error("Genres fetch failed", err);
        setIsGenresLoading(false);
      });

    fetch(`https://api.themoviedb.org/3/configuration/languages?api_key=${import.meta.env.VITE_TMDB_API_KEY}`)
      .then(res => res.json())
      .then(data => {
        const sortedLanguages = data.sort((a, b) => a.english_name.localeCompare(b.english_name));
        setLanguages(sortedLanguages);
      })
      .catch(err => console.error("Languages fetch failed", err));
  }, []);

  // Handle URL parameters for filter restoration
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const contentTypeParam = searchParams.get('contentType');
    
    if (categoryParam && contentTypeParam) {
      const languageParam = searchParams.get('language');
      const genresParam = searchParams.get('genres');
      const sortParam = searchParams.get('sort');
      const pageParam = parseInt(searchParams.get('page')) || 1;
      
      console.log('📊 URL Params detected:', { 
        sort: sortParam, 
        genres: genresParam, 
        language: languageParam 
      });
      
      // Restore state with immediate values
      const restoredGenres = genresParam ? genresParam.split(',').map(g => parseInt(g)).filter(g => !isNaN(g)) : [];
      const restoredSort = sortParam || 'popularity.desc';
      const restoredLanguage = languageParam || '';
      
      // Set all states
      setSelectedContentType(contentTypeParam);
      setSelectedLanguage(restoredLanguage);
      setSelectedGenres(restoredGenres);
      setSelectedSortBy(restoredSort);
      
      if (contentTypeParam === 'movies') {
        setSelectedMovieCategory(categoryParam);
        setSelectedTVCategory('');
      } else if (contentTypeParam === 'tv') {
        setSelectedTVCategory(categoryParam);
        setSelectedMovieCategory('');
      }
      
      // Call fetch with restored values directly
      setTimeout(() => {
        console.log('🚀 Calling fetch with restored values:', {
          genres: restoredGenres,
          sort: restoredSort,
          language: restoredLanguage
        });
        
        // Temporarily update the state and then fetch
        fetchWithUrlParams(contentTypeParam, categoryParam, pageParam, {
          genres: restoredGenres,
          sort: restoredSort,
          language: restoredLanguage
        });
      }, 300);
    }
  }, [searchParams]);


  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const contentTypeParam = searchParams.get('contentType');
    
    if (categoryParam && contentTypeParam) {
      const pageParam = parseInt(searchParams.get('page')) || 1;
      
      const timer = setTimeout(() => {
        fetchByContentTypeAndCategory(contentTypeParam, categoryParam, pageParam);
      }, 50);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const fetchWithUrlParams = async (contentType, category, page = 1, urlParams = {}) => {
    setIsLoading(true);
    setHasSearched(true);
    setQuery('');
    setIsFilterMode(true);
    
    try {
      let results = [];
      let totalPagesCount = 1;
      
      const buildDiscoverUrl = (baseEndpoint) => {
        const today = new Date().toISOString().split('T')[0];
        let url = `https://api.themoviedb.org/3/discover/${baseEndpoint}?api_key=${import.meta.env.VITE_TMDB_API_KEY}&page=${page}`;
        
        // Use URL parameters directly instead of state
        if (urlParams.sort && urlParams.sort !== 'popularity.desc') {
          url += `&sort_by=${urlParams.sort}`;
          console.log('✅ Added sort to URL:', urlParams.sort);
        }
        
        if (urlParams.genres && urlParams.genres.length > 0) {
          url += `&with_genres=${urlParams.genres.join(',')}`;
          console.log('✅ Added genres to URL:', urlParams.genres);
        }
        
        if (urlParams.language) {
          url += `&with_original_language=${urlParams.language}`;
          console.log('✅ Added language to URL:', urlParams.language);
        }
        
        // Use current state for other filters
        if (selectedRating > 0) {
          url += `&vote_average.gte=${selectedRating}`;
        }
        
        if (selectedRuntime > 0) {
          url += `&with_runtime.gte=${selectedRuntime}`;
        }
        
        if (fromDate || toDate) {
          const dateField = baseEndpoint === 'movie' ? 'primary_release_date' : 'first_air_date';
          if (fromDate) url += `&${dateField}.gte=${fromDate}`;
          if (toDate) url += `&${dateField}.lte=${toDate}`;
        }
        
        // Add category-specific parameters
        if (baseEndpoint === 'movie') {
          if (category === 'top_rated') {
            url += '&vote_count.gte=100';
            if (!urlParams.sort || urlParams.sort === 'popularity.desc') {
              url += '&sort_by=vote_average.desc';
            }
          } else if (category === 'upcoming') {
            url += `&primary_release_date.gte=${today}`;
          } else if (category === 'now_playing') {
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
            const oneMonthAgoStr = oneMonthAgo.toISOString().split('T')[0];
            url += `&primary_release_date.gte=${oneMonthAgoStr}&primary_release_date.lte=${today}`;
          } else if (category === 'popular' || category === 'all') {
            if (!urlParams.sort || urlParams.sort === 'popularity.desc') {
              url += '&sort_by=popularity.desc';
            }
          }
        } else if (baseEndpoint === 'tv') {
          if (category === 'top_rated') {
            url += '&vote_count.gte=100';
            if (!urlParams.sort || urlParams.sort === 'popularity.desc') {
              url += '&sort_by=vote_average.desc';
            }
          } else if (category === 'airing_today') {
            url += `&air_date.gte=${today}&air_date.lte=${today}`;
          } else if (category === 'on_the_air') {
            url += `&air_date.lte=${today}&first_air_date.lte=${today}`;
          } else if (category === 'popular' || category === 'all') {
            if (!urlParams.sort || urlParams.sort === 'popularity.desc') {
              url += '&sort_by=popularity.desc';
            }
          }
        }
        
        console.log('🔗 Final API URL with URL params:', url);
        return url;
      };
      
      // Rest of your existing fetch logic...
      if (contentType === 'movies') {
        const apiUrl = buildDiscoverUrl('movie');
        const res = await fetch(apiUrl);
        const data = await res.json();
        results = data.results.map(item => ({ ...item, media_type: 'movie' }));
        totalPagesCount = Math.min(data.total_pages || 1, 500);
        setCurrentCategory(`movies_${category}`);
      }
      else if (contentType === 'tv') {
        const apiUrl = buildDiscoverUrl('tv');
        const res = await fetch(apiUrl);
        const data = await res.json();
        results = data.results.map(item => ({ ...item, media_type: 'tv' }));
        totalPagesCount = Math.min(data.total_pages || 1, 500);
        setCurrentCategory(`tv_${category}`);
      }
      else if (contentType === 'all') {
        const [movieRes, tvRes] = await Promise.all([
          fetch(buildDiscoverUrl('movie')),
          fetch(buildDiscoverUrl('tv'))
        ]);
        
        const [movieData, tvData] = await Promise.all([movieRes.json(), tvRes.json()]);
        
        results = [
          ...movieData.results.map(item => ({ ...item, media_type: 'movie' })),
          ...tvData.results.map(item => ({ ...item, media_type: 'tv' }))
        ];
        totalPagesCount = Math.min(Math.max(movieData.total_pages || 1, tvData.total_pages || 1), 500);
        setCurrentCategory(`all_${category}`);
      }
      
      setResults(results);
      setTotalPages(totalPagesCount);
      setCurrentPage(page);
      
    } catch (error) {
      console.error("Discover API fetch failed", error);
      setResults([]);
      setTotalPages(1);
      setCurrentPage(1);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="filters">
      <h3>Filter By</h3>

      {isSearchMode && (
        <div className="filter-section search-context">
          <h4>Current Search</h4>
          <p className="search-term">"{currentSearchQuery}"</p>
          <small>{originalSearchResults.length} results found</small>
        </div>
      )}

      {/* Sort Results By Dropdown */}
      <div className="filter-section">
        <h4>Sort Results By</h4>
        <select 
          value={selectedSortBy} 
          onChange={(e) => setSelectedSortBy(e.target.value)}
          disabled={isSearchMode}
        >
          <option value="popularity.desc">Popularity Descending</option>
          <option value="popularity.asc">Popularity Ascending</option>
          <option value="vote_average.desc">Rating Descending</option>
          <option value="vote_average.asc">Rating Ascending</option>
          <option value="primary_release_date.desc">Release Date Descending</option>
          <option value="primary_release_date.asc">Release Date Ascending</option>
          <option value="first_air_date.desc">Air Date Descending</option>
          <option value="first_air_date.asc">Air Date Ascending</option>
          <option value="title.asc">Title (A-Z)</option>
          <option value="title.desc">Title (Z-A)</option>
        </select>
        {isSearchMode && (
          <small className="filter-disabled-note">
            Sorting is not available during search.
          </small>
        )}
      </div>

      {/* Content Type Filter */}
      <div className="filter-section">
        <h4>Content Type</h4>
        <select 
          value={selectedContentType} 
          onChange={(e) => setSelectedContentType(e.target.value)}
        >
          <option value="all">Movies & TV Shows</option>
          <option value="movies">Movies Only</option>
          <option value="tv">TV Shows Only</option>
        </select>
      </div>

      {/* Movie Categories */}
      {(selectedContentType === 'movies' || selectedContentType === 'all') && (
        <div className="filter-section">
          <h4>Movie Categories</h4>
          <select 
            value={selectedMovieCategory} 
            onChange={(e) => setSelectedMovieCategory(e.target.value)}
            disabled={isSearchMode}
          >
            <option value="">Select Category</option>
            <option value="all">All Movies</option>
            <option value="popular">Popular</option>
            <option value="top_rated">Top Rated</option>
            <option value="upcoming">Upcoming</option>
            <option value="now_playing">Now Playing</option>
          </select>
        </div>
      )}

      {/* TV Categories */}
      {(selectedContentType === 'tv' || selectedContentType === 'all') && (
        <div className="filter-section">
          <h4>TV Show Categories</h4>
          <select 
            value={selectedTVCategory} 
            onChange={(e) => setSelectedTVCategory(e.target.value)}
            disabled={isSearchMode}
          >
            <option value="">Select Category</option>
            <option value="all">All TV Shows</option>
            <option value="popular">Popular</option>
            <option value="top_rated">Top Rated</option>
            <option value="airing_today">Airing Today</option>
            <option value="on_the_air">On TV</option>
          </select>
        </div>
      )}

      {/* Genres Filter */}
      <div className="filter-section">
        <h4>Genres</h4>
        {isGenresLoading ? (
          <div className="spinner-container">
            <BeatLoader
              color="#007bff"
              loading={isGenresLoading}
              size={8}
              aria-label="Loading Genres"
            />
            <span>Loading genres...</span>
          </div>
        ) : (
          <div className={`genres-grid ${isSearchMode ? 'disabled-filter' : ''}`}>
            {genres.map((genre) => (
              <label key={genre.id} className="genre-checkbox">
                <input 
                  type="checkbox" 
                  value={genre.id}
                  checked={selectedGenres.includes(genre.id)}
                  onChange={() => handleGenreChange(genre.id)}
                  disabled={isSearchMode}
                />
                <span>{genre.name}</span>
              </label>
            ))}
          </div>
        )}
        {isSearchMode && (
          <small className="filter-disabled-note">
            Genre filtering is not available during search. Clear search to use genre filters.
          </small>
        )}
      </div>

      {/* Release Date Range */}
      <div className="filter-section">
        <h4>Release Date</h4>
        <div className={`date-range ${isSearchMode ? 'disabled-filter' : ''}`}>
          <label>From:</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            disabled={isSearchMode}
          />
          <label>To:</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            disabled={isSearchMode}
          />
        </div>
        {isSearchMode && (
          <small className="filter-disabled-note">
            Date filtering is not available during search.
          </small>
        )}
      </div>

      {/* Rating Filter */}
      <div className="filter-section">
        <h4>Minimum Rating: {selectedRating}/10</h4>
        <div className={`rating-container ${isSearchMode ? 'disabled-filter' : ''}`}>
          <input 
            type="range" 
            min="0" 
            max="10" 
            step="0.5" 
            value={selectedRating}
            onChange={(e) => setSelectedRating(parseFloat(e.target.value))}
            className="rating-slider"
            disabled={isSearchMode}
          />
          <div className="rating-scale">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
              <span key={num} className="scale-number">{num}</span>
            ))}
          </div>
        </div>
        {isSearchMode && (
          <small className="filter-disabled-note">
            Rating filtering is not available during search.
          </small>
        )}
      </div>

      {/* Runtime Filter */}
      <div className="filter-section">
        <h4>Minimum Runtime: {selectedRuntime} min</h4>
        <div className={`runtime-container ${isSearchMode ? 'disabled-filter' : ''}`}>
          <input 
            type="range" 
            min="0" 
            max="300" 
            step="15" 
            value={selectedRuntime}
            onChange={(e) => setSelectedRuntime(parseInt(e.target.value))}
            className="runtime-slider"
            disabled={isSearchMode}
          />
          <div className="runtime-scale">
            <span>0</span>
            <span>60</span>
            <span>120</span>
            <span>180</span>
            <span>240</span>
            <span>300+</span>
          </div>
        </div>
        {isSearchMode && (
          <small className="filter-disabled-note">
            Runtime filtering is not available during search.
          </small>
        )}
      </div>

      {/* Language Filter */}
      <div className="filter-section">
        <h4>Language</h4>
        <select 
          value={selectedLanguage} 
          onChange={(e) => setSelectedLanguage(e.target.value)}
        >
          <option value="">All Languages</option>
          {languages.map((language) => (
            <option key={language.iso_639_1} value={language.iso_639_1}>
              {language.english_name}
            </option>
          ))}
        </select>
      </div>

      {/* Filter Action Buttons */}
      <div className="filter-section">
        <button 
          className="apply-filter-btn"
          onClick={handleFilterApply}
          disabled={isFilterButtonDisabled()}
        >
          {getFilterButtonText()}
        </button>
        
        <button 
          className="clear-filter-btn"
          onClick={clearAllFilters}
        >
          Clear All Filters
        </button>
      </div>

      {/* Pagination inside filters */}
      {!isSearchMode && hasSearched && results.length > 0 && totalPages > 1 && (
        <div className="filter-pagination">
          <p className="filter-page-info">
            Page {currentPage} of {totalPages}
          </p>
          <PageNav
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handleFilterPageChange}
          />
        </div>
      )}
    </div>
  );
}

export default FilterMovies;
