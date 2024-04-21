const axios = require('axios');

// Function to fetch data with limited retries
const fetchDataWithLimitedRetries = async (url, params, maxAttempts = 2, waitTime = 2000) => {
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    try {
      const response = await axios.get(url, { params });
      return response.data;
    } catch (error) {
      console.error(`Attempt ${attempts + 1} failed.`);
      attempts++;
      if (attempts === maxAttempts) {
        console.error(`Max attempts reached. Restarting the process...`);
        attempts = 0;
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
};

module.exports = { fetchDataWithLimitedRetries };