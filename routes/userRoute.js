const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/authMiddleware');
const Bookmark = require('../models/Bookmark');

// Route to store a bookmark for a movie or TV show
router.post('/bookmark', verifyToken, async (req, res) => {
    try {
        const token = req.headers.authorization;
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                throw new Error('Token verification failed');
            }

            const { id, mediaType, backdrop_path, name, date } = req.body;
            const userId = decodedToken.userId;

            // Validate input data
            if (!id || !mediaType || (mediaType !== 'movie' && mediaType !== 'tv')) {
                return res.status(400).json({ error: 'Invalid input data' });
            }

            // Create a new bookmark entry
            const newBookmark = new Bookmark({
                userId,
                id,
                name,
                date,
                mediaType,
                backdrop_path
            });

            // Save the bookmark to the database
            await newBookmark.save();

            res.json({ message: 'Bookmark saved successfully' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while saving the bookmark' });
    }
});

// Route to delete a bookmark for a movie or TV show
router.delete('/bookmark/:id&:mediaType', verifyToken, async (req, res) => {
    try {
        const token = req.headers.authorization;
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                throw new Error('Token verification failed');
            }

            const userId = decodedToken.userId;
            const bookmarkId = req.params.id;
            const mediaType = req.params.mediaType;

            // Find and delete the bookmark based on the provided ID and user ID
            const deletedBookmark = await Bookmark.findOneAndDelete({ id: bookmarkId, mediaType: mediaType, userId });

            if (!deletedBookmark) {
                return res.status(404).json({ error: 'Bookmark not found or unauthorized to delete' });
            }

            res.json({ message: 'Bookmark deleted successfully' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while deleting the bookmark' });
    }
});

// Route to get all bookmarks
router.get('/bookmarks', verifyToken, async (req, res) => {
    try {
      const token = req.headers.authorization;
      jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
        if (err) {
          throw new Error('Token verification failed');
        }
  
        const userId = decodedToken.userId;
  
        // Fetch all bookmarks for the user from the database
        const userBookmarks = await Bookmark.find({ userId });
  
        // Extracting required data - IDs and media types
        const allBookmarksData = userBookmarks.map(bookmark => ({ id: bookmark.id, mediaType: bookmark.mediaType, backdrop_path: bookmark.backdrop_path, name: bookmark.name, date: bookmark.date }));
  
        res.status(200).json(allBookmarksData);
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching bookmarks' });
    }
  });
  
module.exports = router;