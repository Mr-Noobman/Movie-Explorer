import { createContext, useContext, useState, useEffect } from 'react';

const WatchlistContext = createContext();

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within WatchlistProvider');
  }
  return context;
};

export const WatchlistProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem('watchlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const addToWatchlist = (movie) => {
    setWatchlist(prev => {
      // Check if movie already exists
      if (prev.some(item => item.id === movie.id)) {
        return prev;
      }
      return [...prev, movie];
    });
  };

  const removeFromWatchlist = (movieId) => {
    setWatchlist(prev => prev.filter(item => item.id !== movieId));
  };

  const toggleWatchlist = (movie) => {
    if (isInWatchlist(movie.id)) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  };

  const isInWatchlist = (movieId) => {
    return watchlist.some(item => item.id === movieId);
  };

  const clearWatchlist = () => {
    setWatchlist([]);
  };

  return (
    <WatchlistContext.Provider 
      value={{ 
        watchlist, 
        addToWatchlist, 
        removeFromWatchlist, 
        toggleWatchlist,
        isInWatchlist,
        clearWatchlist,
        watchlistCount: watchlist.length
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};