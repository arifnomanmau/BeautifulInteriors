// Base URL for API requests - fixed to avoid initialization errors
let API_BASE_URL = '';

// Only run this in browser environment to avoid SSR issues
if (typeof window !== 'undefined') {
  // Use window.location.origin as a safe default in production
  API_BASE_URL = window.location.origin;
}

export { API_BASE_URL }; 