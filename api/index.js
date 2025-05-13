import { db } from '../lib/db';
import { portfolioItems, testimonials, consultations, users } from '../lib/schema';
import { eq, sql } from 'drizzle-orm';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Get the path from the URL
  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname.replace(/^\/api/, '');
  
  console.log('API request to:', path, 'Method:', req.method);

  try {
    // Simple ping endpoint
    if (path === '/ping' || path === '') {
      return res.status(200).json({
        status: 'ok',
        message: 'API is running',
        timestamp: new Date().toISOString()
      });
    }
    
    // Simple login endpoint with hardcoded response
    if (path === '/login' && req.method === 'POST') {
      console.log('Login request received');
      
      // Return hardcoded successful response
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        user: {
          id: 1,
          username: 'admin',
          isAdmin: true
        }
      });
    }
    
    // Simple user endpoint
    if (path === '/user' && req.method === 'GET') {
      // Return hardcoded user
      return res.status(200).json({
        id: 1,
        username: 'admin',
        isAdmin: true
      });
    }
    
    // Default 404 response
    res.status(404).json({ error: 'Not found', path });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}
