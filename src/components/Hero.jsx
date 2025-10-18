import { motion } from 'framer-motion';
import { useWatchlist } from '../context/WatchlistContext';
import { getBackdropUrl } from '../utils/tmdbApi';

const Hero = ({ movie }) => {
  const { toggleWatchlist, isInWatchlist } = useWatchlist();
  
  if (!movie) return null;

  const backdropUrl = getBackdropUrl(movie.backdrop_path);
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
  const runtime = movie.runtime ? `${movie.runtime} min` : null;
  
  // Get trailer from videos if available
  const trailerKey = movie.videos?.results?.find(
    video => video.type === 'Trailer' && video.site === 'YouTube'
  )?.key;

  const handleWatchTrailer = () => {
    if (trailerKey) {
      window.open(`https://www.youtube.com/watch?v=${trailerKey}`, '_blank');
    }
  };

  return (
    <div className="relative h-[600px] overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0">
        <img
          src={backdropUrl}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/90 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          {/* Featured Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-block mb-4"
          >
            <span className="px-4 py-1.5 bg-neon-blue text-gray-950 text-sm font-bold rounded-full">
              Featured Movie
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-display font-bold text-white mb-4 leading-tight"
          >
            {movie.title}
          </motion.h1>

          {/* Meta Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-4 mb-4 text-gray-300"
          >
            {/* Rating */}
            <div className="flex items-center gap-1">
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-semibold">{rating}</span>
            </div>

            <span className="text-gray-500">•</span>
            <span>{releaseYear}</span>

            {runtime && (
              <>
                <span className="text-gray-500">•</span>
                <span>{runtime}</span>
              </>
            )}

            {/* Genres */}
            {movie.genres && movie.genres.length > 0 && (
              <>
                <span className="text-gray-500">•</span>
                <span>{movie.genres.slice(0, 2).map(g => g.name).join(', ')}</span>
              </>
            )}
          </motion.div>

          {/* Tagline */}
          {movie.tagline && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-lg text-neon-blue italic mb-6"
            >
              "{movie.tagline}"
            </motion.p>
          )}

          {/* Overview */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-gray-300 text-lg leading-relaxed mb-8 line-clamp-3"
          >
            {movie.overview}
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex items-center gap-4"
          >
            {/* Watch Trailer Button */}
            {trailerKey && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleWatchTrailer}
                className="px-6 py-3 bg-neon-blue text-gray-950 font-bold rounded-lg
                         hover:bg-neon-blue/90 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
                Watch Trailer
              </motion.button>
            )}

            {/* Add to Watchlist Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleWatchlist(movie)}
              className={`px-6 py-3 border-2 rounded-lg font-bold
                       transition-all flex items-center gap-2 shadow-lg ${
                         isInWatchlist(movie.id)
                           ? 'bg-neon-pink border-neon-pink text-white shadow-neon-pink/50'
                           : 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700'
                       }`}
            >
              <svg className="w-5 h-5" fill={isInWatchlist(movie.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              {isInWatchlist(movie.id) ? 'In Watchlist' : 'Add to Watchlist'}
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;