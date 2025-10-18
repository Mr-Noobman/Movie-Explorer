import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FilterSidebar = ({ genres = [], filters, onFilterChange, isOpen, onToggle }) => {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [selectedYear, setSelectedYear] = useState('All Years');

  const currentYear = new Date().getFullYear();
  const years = ['All Years', ...Array.from({ length: 30 }, (_, i) => currentYear - i)];

  useEffect(() => {
    setSelectedGenres(filters.genres || []);
    setMinRating(filters.ratingFrom || 0);
  }, [filters]);

  const handleGenreToggle = (genreId) => {
    const newGenres = selectedGenres.includes(genreId)
      ? selectedGenres.filter(id => id !== genreId)
      : [...selectedGenres, genreId];
    
    setSelectedGenres(newGenres);
    onFilterChange({ ...filters, genres: newGenres });
  };

  const handleRatingChange = (value) => {
    setMinRating(value);
    onFilterChange({ ...filters, ratingFrom: value > 0 ? value : null });
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
    if (year === 'All Years') {
      onFilterChange({ ...filters, yearFrom: null, yearTo: null });
    } else {
      onFilterChange({ ...filters, yearFrom: year, yearTo: year });
    }
  };

  const clearFilters = () => {
    setSelectedGenres([]);
    setMinRating(0);
    setSelectedYear('All Years');
    onFilterChange({
      genres: [],
      yearFrom: null,
      yearTo: null,
      ratingFrom: null,
      ratingTo: null,
      sortBy: 'popularity.desc',
    });
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onToggle}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />

            {/* Sidebar */}
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed lg:sticky top-24 left-0 h-[calc(100vh-7rem)] 
                       w-80 lg:w-72 z-50 overflow-y-auto
                       glass-card p-6 rounded-r-2xl lg:rounded-xl
                       shadow-2xl border-r border-white/10"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-display font-bold text-white">Filters</h3>
                <div className="flex items-center gap-2">
                  {(selectedGenres.length > 0 || minRating > 0 || selectedYear !== 'All Years') && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-neon-blue hover:text-neon-blue/80 transition-colors font-medium"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    onClick={onToggle}
                    className="lg:hidden w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center
                             hover:bg-white/20 transition-colors"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Genre Filter */}
              <div className="mb-8">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                  GENRE
                </h4>
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
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <div className="w-4 h-4 border-2 border-neon-blue border-t-transparent rounded-full animate-spin"></div>
                    Loading genres...
                  </div>
                )}
              </div>

              {/* Minimum Rating Filter */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                    MIN RATING
                  </h4>
                  <span className="px-3 py-1 bg-yellow-400/20 text-yellow-400 font-bold text-sm rounded-full">
                    {minRating > 0 ? `${minRating.toFixed(1)}+` : 'Any'}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={minRating}
                  onChange={(e) => handleRatingChange(parseFloat(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer
                           [&::-webkit-slider-thumb]:appearance-none
                           [&::-webkit-slider-thumb]:w-5
                           [&::-webkit-slider-thumb]:h-5
                           [&::-webkit-slider-thumb]:rounded-full
                           [&::-webkit-slider-thumb]:bg-gradient-to-r
                           [&::-webkit-slider-thumb]:from-neon-blue
                           [&::-webkit-slider-thumb]:to-neon-pink
                           [&::-webkit-slider-thumb]:cursor-pointer
                           [&::-webkit-slider-thumb]:shadow-lg
                           [&::-webkit-slider-thumb]:shadow-neon-blue/50
                           [&::-moz-range-thumb]:w-5
                           [&::-moz-range-thumb]:h-5
                           [&::-moz-range-thumb]:rounded-full
                           [&::-moz-range-thumb]:bg-neon-blue
                           [&::-moz-range-thumb]:border-0
                           [&::-moz-range-thumb]:cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-2 font-semibold">
                  <span>0</span>
                  <span>5</span>
                  <span>10</span>
                </div>
              </div>

              {/* Release Year Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
                  YEAR
                </h4>
                <select
                  value={selectedYear}
                  onChange={(e) => handleYearChange(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl
                           text-white font-semibold focus-ring appearance-none cursor-pointer
                           hover:bg-white/15 transition-colors
                           bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27rgb(0,217,255)%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')]
                           bg-[length:1.5em_1.5em]
                           bg-[position:right_0.75rem_center]
                           bg-no-repeat pr-12"
                >
                  {years.map((year) => (
                    <option key={year} value={year} className="bg-gray-900 text-white font-semibold">
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              {/* Active Filters Count */}
              {(selectedGenres.length > 0 || minRating > 0 || selectedYear !== 'All Years') && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-neon-blue/10 border border-neon-blue/30 rounded-xl"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-neon-blue rounded-full flex items-center justify-center">
                      <span className="text-gray-950 font-bold text-sm">
                        {selectedGenres.length + (minRating > 0 ? 1 : 0) + (selectedYear !== 'All Years' ? 1 : 0)}
                      </span>
                    </div>
                    <span className="text-white font-semibold text-sm">
                      Active Filter{selectedGenres.length + (minRating > 0 ? 1 : 0) + (selectedYear !== 'All Years' ? 1 : 0) !== 1 ? 's' : ''}
                    </span>
                  </div>
                </motion.div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default FilterSidebar;