const axios = require('axios');

const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search';
const API_KEY = process.env.YOUTUBE_API_KEY;

const searchVideos = async (query) => {
    try {
        // First try to find playlists
        const params = {
            part: 'snippet',
            q: query,
            key: API_KEY,
            type: 'playlist', // Prioritize playlists
            relevanceLanguage: 'hi',
            publishedAfter: '2024-01-01T00:00:00Z',
            order: 'viewCount',
            maxResults: 3
        };

        let response = await axios.get(YOUTUBE_API_URL, { params });
        let items = response.data.items;

        // If not enough playlists, fetch videos to fill the gap
        if (items.length < 3) {
            const videoParams = {
                ...params,
                type: 'video',
                maxResults: 3 - items.length
            };
            const videoResponse = await axios.get(YOUTUBE_API_URL, { params: videoParams });
            items = [...items, ...videoResponse.data.items];
        }

        return items;
    } catch (error) {
        console.error("Error in searchVideos:", error.response?.data || error.message);
        throw new Error("Failed to fetch data from YouTube API");
    }
};

module.exports = { searchVideos };
