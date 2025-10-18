import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FilterModal = ({ isOpen, onClose, genres = [], filters, onFilterChange }) => {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [selectedYear, setSelectedYear] = useState('All Years');
  const [sortBy, setSortBy] = useState('popularity.desc');

  const currentYear = new Date().getFullYear();
  const years = ['All Years', ...Array.from({ length: 30 }, (_, i) => currentYear - i)];

  useEffect(() => {
    if (filters) {
      setSelectedGenres(filters.genres || []);
      setMinRating(filters.ratingFrom || 0);
      setSortBy(filters.sortBy || 'popularity.desc');
    }
  }, [filters]);

  const handleGenreToggle = (genreId) => {
    const newGenres = selectedGenres.includes(genreId)
      ? selectedGenres.filter(id => id !== genreId)
      : [...selectedGenres, genreId];
    
    setSelectedGenres(newGenres);
  };

  const handleApply = () => {
    const newFilters = {
      genres: selectedGenres,
      yearFrom: selectedYear === 'All Years' ? null : selectedYear,
      yearTo: selectedYear === 'All Years' ? null : selectedYear,
      ratingFrom: minRating > 0 ? minRating : null,
      ratingTo: null,
      sortBy: sortBy,
    };
    onFilterChange(newFilters);
    onClose();
  };

  const handleReset = () => {
    setSelectedGenres([]);
    setMinRating(0);
    setSelectedYear('All Years');
    setSortBy('popularity.desc');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="glass-card rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto
                   border border-white/20 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-display font-bold text-white mb-1">Filter Movies</h2>
              <p className="text-gray-400 text-sm">Customize your movie search</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 
                       flex items-center justify-center transition-colors"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Filters Grid */}
          <div className="space-y-8">
            {/* Sort By */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-neon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                </svg>
                Sort By
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { value: 'popularity.desc', label: '🔥 Most Popular' },
                  { value: 'vote_average.desc', label: '⭐ Highest Rated' },
                  { value: 'release_date.desc', label: '🆕 Newest First' },
                  { value: 'release_date.asc', label: '📅 Oldest First' },
                  { value: 'title.asc', label: '🔤 A to Z' },
                  { value: 'revenue.desc', label: '💰 Top Grossing' },
                ].map((option) => (
                  <motion.button
                    key={option.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSortBy(option.value)}
                    className={`px-4 py-3 rounded-xl font-semibold transition-all text-left ${
                      sortBy === option.value
                        ? 'bg-gradient-to-r from-neon-blue to-neon-pink text-white shadow-lg'
                        : 'bg-white/10 text-gray-300 hover:bg-white/15 border border-white/10'
                    }`}
                  >
                    {option.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Genres */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-neon-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Genres
              </h3>
              {genres.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {genres.map((genre) => (
                    <motion.button
                      key={genre.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleGenreToggle(genre.id)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                        selectedGenres.includes(genre.id)
                          ? 'bg-neon-blue text-gray-950 shadow-lg shadow-neon-blue/30'
                          : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                      }`}
                    >
                      {genre.name}
                    </motion.button>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-gray-400">
                  <div className="w-5 h-5 border-2 border-neon-blue border-t-transparent rounded-full animate-spin"></div>
                  Loading genres...
                </div>
              )}
            </div>

            {/* Rating */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Minimum Rating
                </h3>
                <span className="px-4 py-2 bg-yellow-400/20 text-yellow-400 font-bold rounded-full text-lg">
                  {minRating > 0 ? `${minRating.toFixed(1)}+` : 'Any'}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={minRating}
                onChange={(e) => setMinRating(parseFloat(e.target.value))}
                className="w-full h-3 bg-white/10 rounded-lg appearance-none cursor-pointer
                         [&::-webkit-slider-thumb]:appearance-none
                         [&::-webkit-slider-thumb]:w-6
                         [&::-webkit-slider-thumb]:h-6
                         [&::-webkit-slider-thumb]:rounded-full
                         [&::-webkit-slider-thumb]:bg-gradient-to-r
                         [&::-webkit-slider-thumb]:from-yellow-400
                         [&::-webkit-slider-thumb]:to-orange-400
                         [&::-webkit-slider-thumb]:cursor-pointer
                         [&::-webkit-slider-thumb]:shadow-lg
                         [&::-webkit-slider-thumb]:shadow-yellow-400/50
                         [&::-moz-range-thumb]:w-6
                         [&::-moz-range-thumb]:h-6
                         [&::-moz-range-thumb]:rounded-full
                         [&::-moz-range-thumb]:bg-yellow-400
                         [&::-moz-range-thumb]:border-0
                         [&::-moz-range-thumb]:cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-400 mt-2 font-semibold">
                <span>0.0</span>
                <span>5.0</span>
                <span>10.0</span>
              </div>
            </div>

            {/* Year */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-neon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Release Year
              </h3>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-5 py-4 bg-white/10 border border-white/20 rounded-xl
                         text-white text-lg font-semibold focus-ring appearance-none cursor-pointer
                         hover:bg-white/15 transition-colors
                         bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27rgb(0,217,255)%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')]
                         bg-[length:1.5em_1.5em]
                         bg-[position:right_1rem_center]
                         bg-no-repeat pr-14"
              >
                {years.map((year) => (
                  <option key={year} value={year} className="bg-gray-900 text-white">
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 mt-8 pt-6 border-t border-white/10">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleReset}
              className="flex-1 px-6 py-3 bg-white/10 border border-white/20 rounded-xl
                       text-white font-semibold hover:bg-white/20 transition-colors"
            >
              Reset All
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleApply}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-neon-blue to-neon-pink
                       text-white font-bold rounded-xl shadow-lg hover:shadow-neon-blue/50
                       transition-all"
            >
              Apply Filters
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FilterModal;