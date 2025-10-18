import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWatchlist } from '../context/WatchlistContext';
import { getBackdropUrl } from '../utils/tmdbApi';

const HeroCarousel = ({ movies }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const { toggleWatchlist, isInWatchlist } = useWatchlist();

  // Preload images for smoother transitions
  useEffect(() => {
    if (!movies || movies.length === 0) return;
    
    const imagePromises = movies.slice(0, 5).map((movie) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = getBackdropUrl(movie.backdrop_path);
        img.onload = resolve;
        img.onerror = reject;
      });
    });

    Promise.all(imagePromises)
      .then(() => setImagesLoaded(true))
      .catch(() => setImagesLoaded(true)); // Continue even if some images fail
  }, [movies]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % movies.length);
  }, [movies.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Auto-scroll every 5 seconds
  useEffect(() => {
    if (movies.length <= 1 || !imagesLoaded) return;
    
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide, movies.length, imagesLoaded]);

  // Memoize current movie data to prevent unnecessary re-renders
  const currentMovieData = useMemo(() => {
    if (!movies || movies.length === 0) return null;
    
    const currentMovie = movies[currentIndex];
    const backdropUrl = getBackdropUrl(currentMovie.backdrop_path);
    const releaseYear = currentMovie.release_date 
      ? new Date(currentMovie.release_date).getFullYear() 
      : 'N/A';
    const rating = currentMovie.vote_average 
      ? currentMovie.vote_average.toFixed(1) 
      : 'N/A';

    return {
      movie: currentMovie,
      backdropUrl,
      releaseYear,
      rating
    };
  }, [movies, currentIndex]);

  if (!currentMovieData) return null;

  const { movie: currentMovie, backdropUrl, releaseYear, rating } = currentMovieData;

  const handleWatchTrailer = () => {
    const searchQuery = encodeURIComponent(`${currentMovie.title} ${releaseYear} official trailer`);
    window.open(`https://www.youtube.com/results?search_query=${searchQuery}`, '_blank');
  };

  return (
    <div className="relative h-[600px] overflow-hidden group">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {/* Background Image with Gradient Overlay */}
          <div className="absolute inset-0">
            <img
              src={backdropUrl}
              alt={currentMovie.title}
              className="w-full h-full object-cover will-change-auto"
              loading="eager"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/90 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent"></div>
          </div>

          {/* Content */}
          <div className="relative h-full container mx-auto px-4 flex items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
              className="max-w-2xl"
            >
              {/* Featured Badge */}
              <div className="inline-block mb-4">
                <span className="px-4 py-1.5 bg-neon-blue text-gray-950 text-sm font-bold rounded-full">
                  Trending Now
                </span>
              </div>

              {/* Title */}
              <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-4 leading-tight">
                {currentMovie.title}
              </h1>

              {/* Meta Info */}
              <div className="flex items-center gap-4 mb-4 text-gray-300">
                {/* Rating */}
                <div className="flex items-center gap-1">
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-semibold">{rating}</span>
                </div>
                <span className="text-gray-500">•</span>
                <span>{releaseYear}</span>
              </div>

              {/* Overview */}
              <p className="text-gray-300 text-lg leading-relaxed mb-8 line-clamp-3">
                {currentMovie.overview}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 flex-wrap">
                {/* Watch Trailer Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleWatchTrailer}
                  className="px-6 py-3 bg-neon-blue text-gray-950 font-bold rounded-lg
                           hover:bg-neon-blue/90 transition-colors flex items-center gap-2 shadow-lg shadow-neon-blue/50"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                  Watch Trailer
                </motion.button>

                {/* Add to Watchlist Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleWatchlist(currentMovie)}
                  className={`px-6 py-3 border-2 rounded-lg font-bold
                           transition-all flex items-center gap-2 shadow-lg ${
                             isInWatchlist(currentMovie.id)
                               ? 'bg-neon-pink border-neon-pink text-white shadow-neon-pink/50'
                               : 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700'
                           }`}
                >
                  <svg className="w-5 h-5" fill={isInWatchlist(currentMovie.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  {isInWatchlist(currentMovie.id) ? 'In Watchlist' : 'Add to Watchlist'}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {movies.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70
                     backdrop-blur-md rounded-full flex items-center justify-center
                     text-white transition-all opacity-0 group-hover:opacity-100 z-10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70
                     backdrop-blur-md rounded-full flex items-center justify-center
                     text-white transition-all opacity-0 group-hover:opacity-100 z-10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {movies.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {movies.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'w-8 bg-neon-blue'
                  : 'w-2 bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroCarousel;
