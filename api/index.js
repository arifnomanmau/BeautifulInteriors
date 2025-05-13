import { db } from '../lib/db';
import { portfolioItems, testimonials, consultations, users } from '../lib/schema';
import { eq, sql } from 'drizzle-orm';

// Consolidated API handler for all endpoints
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

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
    
    // Login endpoint with hardcoded response
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
    
    // User endpoint
    if (path === '/user' && req.method === 'GET') {
      // Return hardcoded user
      return res.status(200).json({
        id: 1,
        username: 'admin',
        isAdmin: true
      });
    }
    
    // Logout endpoint
    if (path === '/logout' && req.method === 'POST') {
      return res.status(200).json({
        success: true,
        message: 'Logged out successfully'
      });
    }
    
    // Portfolio endpoints
    if (path.startsWith('/portfolio')) {
      const segments = path.split('/').filter(Boolean);
      const id = segments.length > 1 ? parseInt(segments[1]) : null;
      
      // Collection endpoint
      if (!id) {
        if (req.method === 'GET') {
          // Return hardcoded portfolio items
          return res.status(200).json([
            {
              id: 1,
              title: 'Modern Living Room',
              description: 'A sleek, contemporary living space',
              imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7',
              category: 'Living Room',
              featured: true
            },
            {
              id: 2,
              title: 'Minimalist Kitchen',
              description: 'Clean lines and functional design',
              imageUrl: 'https://images.unsplash.com/photo-1556911220-bff31c812dba',
              category: 'Kitchen',
              featured: true
            }
          ]);
        }
      } else {
        // Single item endpoint
        if (req.method === 'GET') {
          return res.status(200).json({
            id: id,
            title: `Portfolio Item ${id}`,
            description: 'Sample description',
            imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7',
            category: 'Sample',
            featured: true
          });
        } else if (req.method === 'PATCH') {
          return res.status(200).json({
            id: id,
            ...req.body,
            updated: true
          });
        }
      }
    }
    
    // Testimonials endpoints
    if (path.startsWith('/testimonials')) {
      if (req.method === 'GET') {
        // Return hardcoded testimonials
        return res.status(200).json([
          {
            id: 1,
            name: 'John Doe',
            role: 'Homeowner',
            content: 'Beautiful Interiors transformed our house into a home!',
            imageUrl: 'https://randomuser.me/api/portraits/men/1.jpg'
          },
          {
            id: 2,
            name: 'Jane Smith',
            role: 'Business Owner',
            content: 'The office redesign was exactly what we needed.',
            imageUrl: 'https://randomuser.me/api/portraits/women/2.jpg'
          }
        ]);
      }
    }
    
    // Consultations endpoints
    if (path.startsWith('/consultations')) {
      if (req.method === 'GET') {
        // Return hardcoded consultations
        return res.status(200).json([
          {
            id: 1,
            name: 'Michael Johnson',
            email: 'michael@example.com',
            phone: '555-1234',
            date: '2023-06-15T10:00:00Z',
            projectType: 'Home Renovation',
            requirements: 'Looking to renovate my living room',
            status: 'pending'
          },
          {
            id: 2,
            name: 'Sarah Williams',
            email: 'sarah@example.com',
            phone: '555-5678',
            date: '2023-06-20T14:00:00Z',
            projectType: 'Office Design',
            requirements: 'Need help designing our new office space',
            status: 'confirmed'
          }
        ]);
      } else if (req.method === 'POST') {
        // Handle new consultation submission
        return res.status(201).json({
          id: 3,
          ...req.body,
          status: 'pending',
          createdAt: new Date().toISOString()
        });
      }
    }
    
    // Login debug page
    if (path === '/login-debug') {
      if (req.method === 'GET') {
        const html = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Login Debug</title>
            <style>
              body { font-family: Arial; max-width: 500px; margin: 0 auto; padding: 20px; }
              button { padding: 10px; }
              pre { background: #f4f4f4; padding: 10px; }
            </style>
          </head>
          <body>
            <h1>Login Debug</h1>
            <form id="loginForm">
              <div>
                <label>Username: <input name="username" value="admin" /></label>
              </div>
              <div>
                <label>Password: <input name="password" type="password" value="admin123" /></label>
              </div>
              <button type="submit">Test Login</button>
            </form>
            <div id="result"></div>
            
            <script>
              document.getElementById('loginForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                const form = e.target;
                const username = form.username.value;
                const password = form.password.value;
                const resultDiv = document.getElementById('result');
                
                resultDiv.innerHTML = 'Testing...';
                
                try {
                  const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                  });
                  
                  const data = await response.json();
                  resultDiv.innerHTML = '<h3>Response:</h3><pre>' + JSON.stringify(data, null, 2) + '</pre>';
                } catch (error) {
                  resultDiv.innerHTML = '<h3>Error:</h3><pre>' + error.message + '</pre>';
                }
              });
            </script>
          </body>
          </html>
        `;
        
        res.setHeader('Content-Type', 'text/html');
        return res.status(200).send(html);
      }
    }
    
    // Default 404 response
    res.status(404).json({ error: 'Not found', path });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}
