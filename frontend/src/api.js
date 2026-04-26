// Centralized API base URL
// In dev: http://localhost:5000  (from frontend/.env)
// In prod: https://careerflip.onrender.com  (from frontend/.env.production)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://careerflip.onrender.com';

export default API_BASE_URL;
