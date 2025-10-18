import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { WatchlistProvider } from './context/WatchlistContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Search from './pages/Search';
import Watchlist from './pages/Watchlist';

function App() {
  return (
    <ThemeProvider>
      <WatchlistProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="search" element={<Search />} />
              <Route path="watchlist" element={<Watchlist />} />
            </Route>
          </Routes>
        </Router>
      </WatchlistProvider>
    </ThemeProvider>
  );
}

export default App;