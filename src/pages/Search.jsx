import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import MovieGrid from '../components/MovieGrid';
import { searchMovies } from '../utils/tmdbApi';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    if (!query) return;

    const performSearch = async () => {
      try {
        setLoading(true);
        const data = await searchMovies(query, 1);
        setMovies(data.results);
        setTotalResults(data.total_results);
        setHasMore(data.page < data.total_pages);
        setPage(1);
      } catch (error) {
        console.error('Error searching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [query]);

  const loadMore = async () => {
    if (!hasMore || loading) return;

    try {
      setLoading(true);
      const nextPage = page + 1;
      const data = await searchMovies(query, nextPage);
      setMovies(prev => [...prev, ...data.results]);
      setPage(nextPage);
      setHasMore(data.page < data.total_pages);
    } catch (error) {
      console.error('Error loading more results:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-display font-bold text-white mb-2">
            Search Results
          </h1>
          {query && (
            <p className="text-gray-400">
              {loading && movies.length === 0 ? (
                'Searching...'
              ) : (
                <>
                  Found <span className="text-neon-blue font-semibold">{totalResults}</span> results for{' '}
                  <span className="text-white font-semibold">"{query}"</span>
                </>
              )}
            </p>
          )}
        </motion.div>

        {/* No Query State */}
        {!query ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <svg
              className="w-32 h-32 text-gray-700 mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h2 className="text-2xl font-display font-bold text-white mb-3">
              Start Searching
            </h2>
            <p className="text-gray-400 text-center max-w-md">
              Use the search bar above to find your favorite movies
            </p>
          </motion.div>
        ) : movies.length === 0 && !loading ? (
          /* No Results State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <svg
              className="w-32 h-32 text-gray-700 mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-2xl font-display font-bold text-white mb-3">
              No results found
            </h2>
            <p className="text-gray-400 text-center max-w-md mb-6">
              We couldn't find any movies matching "{query}". Try a different search term.
            </p>
            <a
              href="/"
              className="px-8 py-3 bg-neon-blue text-gray-950 font-bold rounded-lg
                       hover:bg-neon-blue/90 transition-colors"
            >
              Browse All Movies
            </a>
          </motion.div>
        ) : (
          /* Results Grid */
          <>
            <MovieGrid movies={movies} loading={loading && movies.length === 0} />

            {/* Load More Button */}
            {hasMore && !loading && movies.length > 0 && (
              <div className="flex justify-center mt-12">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={loadMore}
                  className="px-8 py-3 bg-white/5 border border-white/10 rounded-lg
                           text-white font-semibold hover:bg-white/10 transition-colors"
                >
                  Load More Results
                </motion.button>
              </div>
            )}

            {loading && page > 1 && (
              <div className="flex justify-center mt-8">
                <div className="w-8 h-8 border-4 border-neon-blue border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Search;