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
  let path;
  try {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    path = url.pathname.replace(/^\/api/, '');
    console.log('API request to:', path, 'Method:', req.method);
  } catch (error) {
    console.error('Error parsing URL:', error);
    path = req.url.replace(/^\/api/, '');
    console.log('Fallback path parsing:', path);
  }

  try {
    // Simple ping endpoint
    if (path === '/ping' || path === '' || path === '/') {
      return res.status(200).json({
        status: 'ok',
        message: 'API is running',
        timestamp: new Date().toISOString()
      });
    }
    
    // Login endpoint
    if (path === '/login' && req.method === 'POST') {
      console.log('Login request received');
      
      // Always return success for now
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
        } else if (req.method === 'POST') {
          // Create a new portfolio item
          return res.status(201).json({
            id: 3, // Generate a new ID
            ...req.body,
            createdAt: new Date().toISOString()
          });
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
        } else if (req.method === 'DELETE') {
          return res.status(200).json({
            id: id,
            deleted: true
          });
        }
      }
    }
    
    // Testimonials endpoints
    if (path.startsWith('/testimonials')) {
      const segments = path.split('/').filter(Boolean);
      const id = segments.length > 1 ? parseInt(segments[1]) : null;
      
      // Collection endpoint
      if (!id) {
        if (req.method === 'GET') {
          // Return hardcoded testimonials
          return res.status(200).json([
            {
              id: 1,
              name: "John Smith",
              role: "Homeowner",
              content: "Beautiful Interiors transformed our living space completely. Their attention to detail and understanding of our needs was exceptional.",
              imageUrl: "https://randomuser.me/api/portraits/men/1.jpg"
            },
            {
              id: 2,
              name: "Sarah Johnson",
              role: "Business Owner",
              content: "The redesign of our office has made a huge difference in our work environment. Our team loves the new space!",
              imageUrl: "https://randomuser.me/api/portraits/women/2.jpg"
            }
          ]);
        } else if (req.method === 'POST') {
          // Create a new testimonial
          const newId = Math.floor(Math.random() * 1000) + 3;
          return res.status(201).json({
            id: newId,
            ...req.body,
            createdAt: new Date().toISOString()
          });
        }
      } else {
        // Single testimonial endpoint
        if (req.method === 'GET') {
          return res.status(200).json({
            id: id,
            name: `Testimonial ${id}`,
            role: "Customer",
            content: "Sample testimonial content",
            imageUrl: "https://randomuser.me/api/portraits/men/3.jpg"
          });
        } else if (req.method === 'PATCH') {
          return res.status(200).json({
            id: id,
            ...req.body,
            updated: true
          });
        } else if (req.method === 'DELETE') {
          return res.status(200).json({
            id: id,
            deleted: true
          });
        }
      }
    }
    
    // Handle 404 for unmatched routes
    return res.status(404).json({ error: 'Not found', path: path });
    
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message
    });
  }
}
