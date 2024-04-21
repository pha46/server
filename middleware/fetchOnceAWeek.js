const AccessTime = require('../models/accessTime');

const fetchOnceAWeek = async (req, res, next) => {
  try {
    let accessTime = await AccessTime.findOne();

    const currentTime = new Date().getTime();

    if (!accessTime) {
      accessTime = new AccessTime({ lastAccessedTime: currentTime });
      await accessTime.save();
      req.fetchOnceAWeek = false; // Set flag to false since it's the first access
      next();
    } else {
      const lastAccessedTime = accessTime.lastAccessedTime ? accessTime.lastAccessedTime.getTime() : 0;

      if (currentTime - lastAccessedTime >= 7 * 24 * 60 * 60 * 1000) {
        accessTime.lastAccessedTime = currentTime;
        await accessTime.save();
        req.fetchOnceAWeek = true; // Set flag to false since it's accessed after a week
        next();
      } else {
        req.fetchOnceAWeek = false; // Set flag to true if accessed within a week
        next();
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = fetchOnceAWeek;