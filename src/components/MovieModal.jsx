import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWatchlist } from '../context/WatchlistContext';
import { fetchMovieDetails, getBackdropUrl, getImageUrl } from '../utils/tmdbApi';

const MovieModal = ({ movieId, onClose }) => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toggleWatchlist, isInWatchlist } = useWatchlist();

  useEffect(() => {
    const loadMovieDetails = async () => {
      try {
        setLoading(true);
        const data = await fetchMovieDetails(movieId);
        setMovie(data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMovieDetails();
  }, [movieId]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleBackdropClick}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <div className="w-12 h-12 border-4 border-neon-blue border-t-transparent rounded-full animate-spin"></div>
      </motion.div>
    );
  }

  if (!movie) return null;

  const backdropUrl = getBackdropUrl(movie.backdrop_path);
  const posterUrl = getImageUrl(movie.poster_path);
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : 'N/A';
  const inWatchlist = isInWatchlist(movie.id);

  const trailerKey = movie.videos?.results?.find(
    video => video.type === 'Trailer' && video.site === 'YouTube'
  )?.key;

  const handleWatchTrailer = () => {
    if (trailerKey) {
      window.open(`https://www.youtube.com/watch?v=${trailerKey}`, '_blank');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm overflow-y-auto p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative max-w-5xl mx-auto my-8 glass-card rounded-2xl overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/60 hover:bg-black/80 
                   rounded-full flex items-center justify-center transition-colors"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Backdrop Header */}
        <div className="relative h-96 overflow-hidden">
          <img
            src={backdropUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent"></div>
          
          {/* Movie Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="flex gap-6">
              {/* Poster */}
              <img
                src={posterUrl}
                alt={movie.title}
                className="w-32 h-48 rounded-lg shadow-2xl hidden sm:block"
              />
              
              {/* Info */}
              <div className="flex-1">
                <h2 className="text-4xl font-display font-bold text-white mb-2">
                  {movie.title}
                </h2>
                <div className="flex items-center gap-4 text-gray-300 mb-4">
                  <div className="flex items-center gap-1">
                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-semibold">{rating}</span>
                  </div>
                  <span>•</span>
                  <span>{releaseYear}</span>
                  <span>•</span>
                  <span>{runtime}</span>
                </div>
                
                {/* Genres */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {movie.genres?.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 bg-white/10 rounded-full text-sm text-white"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Action Buttons */}
          <div className="flex gap-4 mb-8">
            {trailerKey && (
              <button
                onClick={handleWatchTrailer}
                className="px-6 py-3 bg-neon-blue text-gray-950 font-bold rounded-lg
                         hover:bg-neon-blue/90 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
                Watch Trailer
              </button>
            )}
            
            <button
              onClick={() => toggleWatchlist(movie)}
              className={`px-6 py-3 border-2 rounded-lg font-bold transition-all 
                       shadow-lg flex items-center gap-2 ${
                inWatchlist
                  ? 'bg-neon-pink border-neon-pink text-white shadow-neon-pink/50'
                  : 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700'
              }`}
            >
              <svg className="w-5 h-5" fill={inWatchlist ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
            </button>
          </div>

          {/* Overview */}
          {movie.overview && (
            <div className="mb-8">
              <h3 className="text-xl font-display font-bold text-white mb-3">Overview</h3>
              <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
            </div>
          )}

          {/* Cast */}
          {movie.credits?.cast && movie.credits.cast.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-display font-bold text-white mb-4">Cast</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {movie.credits.cast.slice(0, 6).map((actor) => (
                  <div key={actor.id} className="text-center">
                    <img
                      src={getImageUrl(actor.profile_path, 'w185')}
                      alt={actor.name}
                      className="w-full aspect-square object-cover rounded-lg mb-2"
                    />
                    <p className="text-white text-sm font-semibold line-clamp-1">{actor.name}</p>
                    <p className="text-gray-400 text-xs line-clamp-1">{actor.character}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Similar Movies */}
          {movie.similar?.results && movie.similar.results.length > 0 && (
            <div>
              <h3 className="text-xl font-display font-bold text-white mb-4">Similar Movies</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {movie.similar.results.slice(0, 5).map((similarMovie) => (
                  <div
                    key={similarMovie.id}
                    className="cursor-pointer group"
                    onClick={() => {
                      setMovie(null);
                      setLoading(true);
                      fetchMovieDetails(similarMovie.id).then(setMovie).finally(() => setLoading(false));
                    }}
                  >
                    <img
                      src={getImageUrl(similarMovie.poster_path)}
                      alt={similarMovie.title}
                      className="w-full aspect-[2/3] object-cover rounded-lg mb-2 
                               transition-transform group-hover:scale-105"
                    />
                    <p className="text-white text-sm font-semibold line-clamp-2">
                      {similarMovie.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MovieModal;