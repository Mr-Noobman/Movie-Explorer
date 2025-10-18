import { useState, memo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWatchlist } from '../context/WatchlistContext';
import { getImageUrl } from '../utils/tmdbApi';
import { useScrolling } from '../hooks/useScrolling';
import MovieModal from './MovieModal';

const MovieCard = memo(({ movie }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);
  const isScrolling = useScrolling();
  const { toggleWatchlist, isInWatchlist } = useWatchlist();

  // Lazy load card when it comes into viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Small delay to batch renders
          requestAnimationFrame(() => {
            setIsVisible(true);
          });
          observer.disconnect();
        }
      },
      { 
        rootMargin: '150px', // Load slightly earlier
        threshold: 0.01 // Trigger as soon as 1% is visible
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const posterUrl = getImageUrl(movie.poster_path);
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
  const inWatchlist = isInWatchlist(movie.id);

  // Get first 2 genre names if available
  const genreNames = movie.genre_ids 
    ? movie.genre_ids.slice(0, 2).join(', ')
    : movie.genres?.slice(0, 2).map(g => g.name).join(', ') || '';

  const handleWatchlistClick = (e) => {
    e.stopPropagation();
    toggleWatchlist(movie);
  };

  const handleCardClick = () => {
    setShowModal(true);
  };

  // Show simple placeholder until card is visible
  if (!isVisible) {
    return (
      <div 
        ref={cardRef}
        className="rounded-xl overflow-hidden bg-gray-800/30 relative"
        style={{ aspectRatio: '2/3' }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 to-gray-900/50" />
      </div>
    );
  }

  return (
    <>
      <motion.div
        whileHover={!isScrolling ? { y: -8 } : {}}
        transition={{ duration: 0.2, ease: "easeOut" }}
        onHoverStart={() => !isScrolling && setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={handleCardClick}
        className="glass-card rounded-xl overflow-hidden cursor-pointer group relative gpu-accelerated"
        style={{ pointerEvents: isScrolling ? 'none' : 'auto' }}
      >
        {/* Poster Image */}
        <div className="relative aspect-[2/3] overflow-hidden bg-gray-800">
          <img
            src={posterUrl}
            alt={movie.title}
            className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${isHovered ? 'will-change-transform' : ''}`}
            loading="lazy"
            decoding="async"
          />
          
          {/* Rating Badge */}
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-yellow-400 rounded-lg z-10 pointer-events-none">
            <svg className="w-4 h-4 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-bold text-gray-900">{rating}</span>
          </div>

          {/* Watchlist Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.15 }}
            onClick={handleWatchlistClick}
            className={`absolute top-3 left-3 w-10 h-10 rounded-full flex items-center justify-center
                     backdrop-blur-md transition-all shadow-lg z-20 cursor-pointer ${
                       inWatchlist
                         ? 'bg-neon-pink text-white shadow-neon-pink/50'
                         : 'bg-gray-900/90 text-white hover:bg-gray-900 border-2 border-white/40'
                     }`}
            style={{ pointerEvents: 'auto' }}
          >
            <svg
              className="w-5 h-5 pointer-events-none"
              fill={inWatchlist ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
          </motion.button>

          {/* Hover Overlay */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent
                         flex items-end p-4"
              >
                <div className="w-full">
                  <p className="text-white text-sm line-clamp-3 mb-2">
                    {movie.overview}
                  </p>
                  <button className="w-full py-2 bg-neon-blue text-gray-950 font-semibold rounded-lg
                                   hover:bg-neon-blue/90 transition-colors">
                    View Details
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Movie Info */}
        <div className="p-4">
          <h3 className="text-white font-semibold text-lg line-clamp-1 mb-1">
            {movie.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>{releaseYear}</span>
            {genreNames && (
              <>
                <span className="text-gray-600">•</span>
                <span className="line-clamp-1">{genreNames}</span>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Movie Details Modal */}
      <AnimatePresence>
        {showModal && (
          <MovieModal
            movieId={movie.id}
            onClose={() => setShowModal(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
});

MovieCard.displayName = 'MovieCard';

export default MovieCard;