const express = require('express');
const router = express.Router();
const apiKey = process.env.API_KEY_V3;
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/authMiddleware');
const checkTokenValidity = require('../middleware/checkTokenValidity');
const { fetchDataWithLimitedRetries } = require('../utils/utils');
const SearchHistory = require('../models/SearchHistory');

// Route to fetch All with limited retry logic
router.get('/searchAll', verifyToken, checkTokenValidity, async (req, res) => {
    const { query, page } = req.query;
    try {
        let searchData = {}; // Initialize as an empty object

        // Store search history for the user
        const token = req.headers.authorization;

        // Verify the token
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                throw new Error('Token verification failed');
            }

            const userId = decodedToken.userId;

            // Find the search history entry for the user and query
            const existingSearch = await SearchHistory.findOne({ userId, query, page});

            if (existingSearch) {
                existingSearch.updatedAt = new Date();
                await existingSearch.save();
                searchData = existingSearch.data; // Return the data object from SearchHistory
            } else {
                const url = 'https://api.themoviedb.org/3/search/multi';
                const params = {
                    api_key: apiKey,
                    language: 'en-US',
                    query,
                    page,
                };

                searchData = await fetchDataWithLimitedRetries(url, params);

                const searchHistory = new SearchHistory({
                    userId,
                    query,
                    page,
                    data: searchData,
                    createdAt: new Date()
                });
                await searchHistory.save();
            }

            res.json(searchData); // Return the data object from SearchHistory or an empty object
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching search data.' });
    }
});

// Route to fetch Series with limited retry logic
router.get('/series', verifyToken, checkTokenValidity, async (req, res) => {
    const { query, page } = req.query;
    try {
        let seriesData = {}; // Initialize as an empty object

        // Store search history for the user
        const token = req.headers.authorization;

        // Verify the token
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                throw new Error('Token verification failed');
            }

            const userId = decodedToken.userId;

            // Find the search history entry for the user and query
            const existingSearch = await SearchHistory.findOne({ userId, query, page, 
                mediaType: "tv" });

            if (existingSearch) {
                existingSearch.updatedAt = new Date();
                await existingSearch.save();
                seriesData = existingSearch.data; // Return the data object from SearchHistory
            } else {

                const url = 'https://api.themoviedb.org/3/search/tv';
                const params = {
                    api_key: apiKey,
                    language: 'en-US',
                    query,
                    page
                };

                seriesData = await fetchDataWithLimitedRetries(url, params);

                const searchHistory = new SearchHistory({
                    userId,
                    query,
                    page,
                    mediaType: "tv",
                    data: seriesData,
                    createdAt: new Date()
                });
                await searchHistory.save();
            }

            res.json(seriesData); // Return the data object from SearchHistory or an empty object
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching series data.' });
    }
});


// Route to fetch Movies with limited retry logic
router.get('/movies', verifyToken, checkTokenValidity, async (req, res) => {
    const { query, page } = req.query;
    try {
        let moviesData = {}; // Initialize as an empty object

        // Store search history for the user
        const token = req.headers.authorization;

        // Verify the token
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                throw new Error('Token verification failed');
            }

            const userId = decodedToken.userId;

            // Find the search history entry for the user and query
            const existingSearch = await SearchHistory.findOne({ userId, query, page,
                mediaType: "movie" });

            if (existingSearch) {
                existingSearch.updatedAt = new Date();
                existingSearch.mediaType = "movie";
                await existingSearch.save();
                moviesData = existingSearch.data; // Return the data object from SearchHistory
            } else {
                const url = 'https://api.themoviedb.org/3/search/movie';
                const params = {
                    api_key: apiKey,
                    language: 'en-US',
                    query,
                    page
                };

                moviesData = await fetchDataWithLimitedRetries(url, params);

                const searchHistory = new SearchHistory({
                    userId,
                    query,
                    page,
                    mediaType: "movie",
                    data: moviesData, // Store the fetched data in the data field
                    createdAt: new Date()
                });
                await searchHistory.save();
            }

            res.json({ data: moviesData }); // Return the data object from SearchHistory or an empty object
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching movies data.' });
    }
});
  
module.exports = router;