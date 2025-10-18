import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import HeroCarousel from '../components/HeroCarousel';
import MovieGrid from '../components/MovieGrid';
import FilterModal from '../components/FilterModal';
import MovieCard from '../components/MovieCard';
import { fetchTrending, fetchGenres, discoverMovies } from '../utils/tmdbApi';

const Home = () => {
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const MAX_MOVIES = 60; // Limit total movies to prevent lag
  const [filters, setFilters] = useState({
    genres: [],
    yearFrom: null,
    yearTo: null,
    ratingFrom: null,
    ratingTo: null,
    sortBy: 'popularity.desc',
  });

  // Make filter modal control available globally
  useEffect(() => {
    window.openFilterModal = () => setIsFilterModalOpen(true);
  }, []);

  const observer = useRef();
  const lastMovieRef = useCallback((node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    }, {
      rootMargin: '200px' // Start loading before reaching the end
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // Fetch genres on mount
  useEffect(() => {
    const loadGenres = async () => {
      try {
        const genreData = await fetchGenres();
        setGenres(genreData || []);
      } catch (error) {
        console.error('Error fetching genres:', error);
        setGenres([]);
      }
    };
    loadGenres();
  }, []);

  // Fetch featured movies and initial movies
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        setMovies([]); // Clear previous movies
        setPage(1); // Reset page
        
        // Get trending movies for featured carousel (top 5 for better performance)
        const trendingData = await fetchTrending('week', 1);
        if (trendingData && trendingData.results && trendingData.results.length > 0) {
          setFeaturedMovies(trendingData.results.slice(0, 5));
        }

        // Get movies based on filters
        const moviesData = await discoverMovies(filters, 1);
        setMovies(moviesData.results || []);
        setHasMore(moviesData.total_pages > 1);
      } catch (error) {
        console.error('Error fetching initial data:', error);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [filters]);

  // Load more movies (infinite scroll)
  const loadMore = async () => {
    if (!hasMore || loading || movies.length >= MAX_MOVIES) return;

    try {
      setLoading(true);
      const nextPage = page + 1;
      const moviesData = await discoverMovies(filters, nextPage);
      const newMovies = moviesData.results || [];
      
      // Limit total movies to MAX_MOVIES
      const remainingSlots = MAX_MOVIES - movies.length;
      const moviesToAdd = newMovies.slice(0, remainingSlots);
      
      setMovies(prev => [...prev, ...moviesToAdd]);
      setPage(nextPage);
      setHasMore(nextPage < moviesData.total_pages && movies.length + moviesToAdd.length < MAX_MOVIES);
    } catch (error) {
      console.error('Error loading more movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen transition-colors duration-300">
      {/* Hero Carousel Section */}
      {featuredMovies.length > 0 && <HeroCarousel movies={featuredMovies} />}

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        genres={genres}
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">

          {/* Movie Grid */}
          <div className="flex-1 transition-all duration-300">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6"
            >
              <h2 className="text-3xl font-display font-bold text-white">
                All Movies <span className="text-neon-blue">({movies.length})</span>
              </h2>
              
              {/* Sort Dropdown */}
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange({ ...filters, sortBy: e.target.value })}
                className="px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl
                         text-white text-sm font-semibold focus-ring appearance-none cursor-pointer
                         hover:bg-white/15 transition-colors
                         bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27rgb(0,217,255)%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')]
                         bg-[length:1.2em_1.2em]
                         bg-[position:right_0.75rem_center]
                         bg-no-repeat pr-10"
              >
                <option value="popularity.desc" className="bg-gray-900">Most Popular</option>
                <option value="vote_average.desc" className="bg-gray-900">Highest Rated</option>
                <option value="release_date.desc" className="bg-gray-900">Newest First</option>
                <option value="release_date.asc" className="bg-gray-900">Oldest First</option>
                <option value="title.asc" className="bg-gray-900">A-Z</option>
              </select>
            </motion.div>

            {/* Movies Grid with Infinite Scroll */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 gpu-accelerated">
              {movies.map((movie, index) => {
                if (movies.length === index + 1) {
                  return (
                    <div key={movie.id} ref={lastMovieRef} className="gpu-accelerated">
                      <MovieCard movie={movie} />
                    </div>
                  );
                } else {
                  return <MovieCard key={movie.id} movie={movie} />;
                }
              })}
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <div className="w-12 h-12 border-4 border-neon-blue border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-400 text-sm font-medium">Loading movies...</p>
              </div>
            )}

            {/* No More Movies */}
            {!hasMore && movies.length > 0 && (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <svg className="w-16 h-16 text-neon-blue/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-white font-semibold text-lg">All Caught Up!</p>
                <p className="text-gray-400 text-sm">
                  {movies.length >= MAX_MOVIES 
                    ? `Showing ${MAX_MOVIES} movies for optimal performance`
                    : "You've seen all the available movies"}
                </p>
                {movies.length >= MAX_MOVIES && (
                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="mt-4 px-6 py-2 bg-neon-blue text-gray-950 font-semibold rounded-lg
                             hover:bg-neon-blue/90 transition-colors"
                  >
                    Back to Top
                  </button>
                )}
              </div>
            )}

            {/* No Movies Found */}
            {!loading && movies.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20">
                <svg className="w-24 h-24 text-gray-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                        d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-400 mb-2">No movies found</h3>
                <p className="text-gray-500">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {movies.length > 8 && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-white/10 backdrop-blur-md
                   border border-white/20 text-white rounded-full shadow-lg
                   flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </motion.button>
      )}
    </div>
  );
};

export default Home;
