// Base URL for API requests
// Use relative URLs in development, absolute URLs in production
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-vercel-domain.vercel.app' // Replace with your actual Vercel domain
  : ''; // Empty string for relative URLs in development 