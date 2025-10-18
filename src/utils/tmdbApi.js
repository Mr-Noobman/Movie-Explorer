import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

// Image URL helpers
export const getImageUrl = (path, size = 'w500') => {
  if (!path) return '/placeholder-movie.png';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getBackdropUrl = (path, size = 'original') => {
  if (!path) return '/placeholder-backdrop.png';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

// API Methods
export const fetchTrending = async (timeWindow = 'week', page = 1) => {
  const response = await tmdbApi.get(`/trending/movie/${timeWindow}`, {
    params: { page },
  });
  return response.data;
};

export const fetchPopularMovies = async (page = 1) => {
  const response = await tmdbApi.get('/movie/popular', {
    params: { page },
  });
  return response.data;
};

export const fetchTopRatedMovies = async (page = 1) => {
  const response = await tmdbApi.get('/movie/top_rated', {
    params: { page },
  });
  return response.data;
};

export const fetchNowPlayingMovies = async (page = 1) => {
  const response = await tmdbApi.get('/movie/now_playing', {
    params: { page },
  });
  return response.data;
};

export const fetchUpcomingMovies = async (page = 1) => {
  const response = await tmdbApi.get('/movie/upcoming', {
    params: { page },
  });
  return response.data;
};

export const searchMovies = async (query, page = 1) => {
  const response = await tmdbApi.get('/search/movie', {
    params: { query, page },
  });
  return response.data;
};

export const fetchMovieDetails = async (movieId) => {
  const response = await tmdbApi.get(`/movie/${movieId}`, {
    params: {
      append_to_response: 'credits,videos,similar',
    },
  });
  return response.data;
};

export const fetchMoviesByGenre = async (genreId, page = 1, sortBy = 'popularity.desc') => {
  const response = await tmdbApi.get('/discover/movie', {
    params: {
      with_genres: genreId,
      sort_by: sortBy,
      page,
    },
  });
  return response.data;
};

export const fetchGenres = async () => {
  const response = await tmdbApi.get('/genre/movie/list');
  return response.data.genres;
};

export const discoverMovies = async (filters = {}, page = 1) => {
  const {
    genres = [],
    yearFrom,
    yearTo,
    ratingFrom,
    ratingTo,
    sortBy = 'popularity.desc',
  } = filters;

  const params = {
    page,
    sort_by: sortBy,
  };

  if (genres.length > 0) {
    params.with_genres = genres.join(',');
  }

  if (yearFrom) {
    params['primary_release_date.gte'] = `${yearFrom}-01-01`;
  }

  if (yearTo) {
    params['primary_release_date.lte'] = `${yearTo}-12-31`;
  }

  if (ratingFrom) {
    params['vote_average.gte'] = ratingFrom;
  }

  if (ratingTo) {
    params['vote_average.lte'] = ratingTo;
  }

  const response = await tmdbApi.get('/discover/movie', { params });
  return response.data;
};

export default tmdbApi;