const express = require('express');
const router = express.Router();
const apiKey = process.env.API_KEY_V3;
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/authMiddleware');
const { fetchDataWithLimitedRetries } = require('../utils/utils');
const fetchOnceAWeek = require('../middleware/fetchOnceAWeek');
const TrendingData = require('../models/TrendingData');
const PopularSeriesData = require('../models/PopularSeries');
const PopularMoviesData = require('../models/PopularMovies');
const SearchHistory = require('../models/SearchHistory');
const checkTokenValidity = require('../middleware/checkTokenValidity');

// Route to fetch Recommended Movies and TV Shows based on search history
router.get('/recommended', verifyToken, checkTokenValidity, async (req, res) => {
  try {
      const token = req.headers.authorization;
      jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
          if (err) {
              throw new Error('Token verification failed');
          }

          const userId = decodedToken.userId;

          const searchHistory = await SearchHistory.find({ userId });

          if (!searchHistory || searchHistory.length === 0) {
              return res.json({ message: 'No search history found to generate recommendations.' });
          }

          const queries = searchHistory.map(history => history.query);

          // // Use the queries to fetch recommended movies and TV shows
          // const recommendedData = [];

          // for (const query of queries) {
          //     const url = 'https://api.themoviedb.org/3/search/multi';
          //     const params = {
          //         api_key: apiKey,
          //         language: 'en-US',
          //         query,
          //         page: 1
          //     };

          //     const response = await fetchDataWithLimitedRetries(url, params);
          //     recommendedData.push(...response.results);
          // }

          // Return the recommended movies and TV shows
          res.json(queries);
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching recommended data.' });
  }
});

// Route to fetch Trending with limited retry logic
router.get('/trending', fetchOnceAWeek, verifyToken, checkTokenValidity, async (req, res) => {
  try {
    let trendingData;

    const accessTime = req.fetchOnceAWeek; // Assuming fetchOnceAWeek middleware sets this flag

    if (!accessTime) {
      const storedTrendingData = await TrendingData.findOne().sort({ createdAt: -1 });

      if (storedTrendingData) {
        trendingData = storedTrendingData.data;
      }
    }

    if (!trendingData) {
      const url = 'https://api.themoviedb.org/3/trending/all/week';
      const params = {
        api_key: apiKey,
        language: 'en-US'
      };

      trendingData = await fetchDataWithLimitedRetries(url, params);

       // Update existing document if it exists, otherwise create a new one
       const existingTrendingData = await TrendingData.findOne().sort({ createdAt: -1 });

       if (existingTrendingData) {
         existingTrendingData.data = trendingData;
         await existingTrendingData.save();
       } else {
         const newTrendingData = new TrendingData({ data: trendingData });
         await newTrendingData.save();
       }
     }

    res.json(trendingData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching trending data.' });
  }
});

// Route to fetch Popular Series with limited retry logic
router.get('/popularSeries', fetchOnceAWeek, verifyToken, checkTokenValidity, async (req, res) => {
  try {
    const { page } = req.query;
    let popularSeriesData;

    const accessTime = req.fetchOnceAWeek; // Assuming fetchOnceAWeek middleware sets this flag

    if (!accessTime) {
      const storedPopularSeriesData = await PopularSeriesData.findOne({ page }).sort({ createdAt: -1 });

      if (storedPopularSeriesData) {
        popularSeriesData = storedPopularSeriesData.data;
      }
    }

    if (!popularSeriesData) {
      const url = 'https://api.themoviedb.org/3/tv/popular';
      const params = {
        api_key: apiKey,
        language: 'en-US',
        page
      };

      popularSeriesData = await fetchDataWithLimitedRetries(url, params);

      const existingPopularSeriesData = await PopularSeriesData.findOne({ page }).sort({ createdAt: -1 });

      if (existingPopularSeriesData) {
        existingPopularSeriesData.data = popularSeriesData;
        await existingPopularSeriesData.save();
      } else {
        const newPopularSeriesData = new PopularSeriesData({ data: popularSeriesData, page });
        await newPopularSeriesData.save();
      }
    }

    res.json(popularSeriesData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching popular series data.' });
  }
});

// Route to fetch Popular Movies with limited retry logic
router.get('/popularMovies', fetchOnceAWeek, verifyToken, checkTokenValidity, async (req, res) => {
  try {
    const { page } = req.query;
    let popularMoviesData;

    const accessTime = req.fetchOnceAWeek; // Assuming fetchOnceAWeek middleware sets this flag

    if (!accessTime) {
      const storedPopularMoviesData = await PopularMoviesData.findOne({ page }).sort({ createdAt: -1 });

      if (storedPopularMoviesData) {
        popularMoviesData = storedPopularMoviesData.data;
      }
    }

    if (!popularMoviesData) {
      const url = 'https://api.themoviedb.org/3/movie/popular';
      const params = {
        api_key: apiKey,
        language: 'en-US',
        page
      };

      popularMoviesData = await fetchDataWithLimitedRetries(url, params);

      const existingPopularMoviesData = await PopularMoviesData.findOne({ page }).sort({ createdAt: -1 });

      if (existingPopularMoviesData) {
        existingPopularMoviesData.data = popularMoviesData;
        await existingPopularMoviesData.save();
      } else {
        const newPopularMoviesData = new PopularMoviesData({ data: popularMoviesData, page });
        await newPopularMoviesData.save();
      }
    }

    res.json(popularMoviesData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching popular movies data.' });
  }
});

module.exports = router;