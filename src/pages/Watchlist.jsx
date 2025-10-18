import { motion } from 'framer-motion';
import { useWatchlist } from '../context/WatchlistContext';
import MovieGrid from '../components/MovieGrid';

const Watchlist = () => {
  const { watchlist, clearWatchlist } = useWatchlist();

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-display font-bold text-white"
          >
            My Watchlist ({watchlist.length})
          </motion.h1>

          {watchlist.length > 0 && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearWatchlist}
              className="px-6 py-2 bg-red-500/20 border border-red-500/50 text-red-400 
                       font-semibold rounded-lg hover:bg-red-500/30 transition-colors"
            >
              Clear All
            </motion.button>
          )}
        </div>

        {/* Empty State */}
        {watchlist.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-32 h-32 mb-8 text-gray-700"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-display font-bold text-white mb-3"
            >
              Your watchlist is empty
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-400 text-center max-w-md mb-8"
            >
              Start adding movies to your watchlist to see them here.
            </motion.p>

            <motion.a
              href="/"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-neon-blue text-gray-950 font-bold rounded-lg
                       hover:bg-neon-blue/90 transition-colors"
            >
              Explore Movies
            </motion.a>
          </motion.div>
        ) : (
          /* Movie Grid */
          <MovieGrid movies={watchlist} loading={false} />
        )}
      </div>
    </div>
  );
};

export default Watchlist;