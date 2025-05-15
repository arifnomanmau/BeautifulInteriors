// Single API handler for all endpoints
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle OPTIONS method (CORS preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Get the path from the URL
  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname.replace(/^\/api/, '');
  
  try {
    // Hard-coded responses for authentication
    if (path === '/login' && req.method === 'POST') {
      // Parse JSON request body
      let body = req.body;
      try {
        if (typeof body === 'string') {
          body = JSON.parse(body);
        }
        const { username, password } = body || {};
        
        // Basic authentication
        if (username === 'admin' && password === 'admin123') {
          return res.status(200).json({ 
            success: true, 
            message: 'Login successful',
            user: { 
              id: 1, 
              username: 'admin', 
              isAdmin: true 
            }
          });
        } else {
          return res.status(401).json({ 
            error: 'Invalid username or password' 
          });
        }
      } catch (error) {
        return res.status(400).json({ 
          error: 'Invalid request body' 
        });
      }
    }
    
    // User info endpoint
    if (path === '/user' && req.method === 'GET') {
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
    
    // Mock portfolio data
    if (path === '/portfolio' && req.method === 'GET') {
      return res.status(200).json([
        {
          id: 1,
          title: 'Modern Living Room',
          description: 'A contemporary living room design with clean lines and neutral colors.',
          imageUrl: 'https://images.unsplash.com/photo-1600210492493-0946911123ea',
          category: 'Living Room',
          featured: true,
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          title: 'Elegant Bedroom',
          description: 'Luxurious bedroom with soft textures and calming colors.',
          imageUrl: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0',
          category: 'Bedroom',
          featured: true,
          createdAt: new Date().toISOString()
        },
        {
          id: 3,
          title: 'Minimalist Kitchen',
          description: 'Clean and functional kitchen design with modern appliances.',
          imageUrl: 'https://images.unsplash.com/photo-1556911220-bff31c812dba',
          category: 'Kitchen',
          featured: false,
          createdAt: new Date().toISOString()
        }
      ]);
    }
    
    // Mock testimonials data
    if (path === '/testimonials' && req.method === 'GET') {
      return res.status(200).json([
        {
          id: 1,
          name: 'John Smith',
          role: 'Homeowner',
          content: 'The team at Beautiful Interiors transformed our space into something truly amazing.',
          imageUrl: 'https://i.pravatar.cc/150?img=1',
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          name: 'Sarah Johnson',
          role: 'Business Owner',
          content: 'Our office renovation exceeded all expectations. Highly recommended!',
          imageUrl: 'https://i.pravatar.cc/150?img=2',
          createdAt: new Date().toISOString()
        }
      ]);
    }
    
    // Mock consultations data
    if (path === '/consultations' && req.method === 'GET') {
      return res.status(200).json([
        {
          id: 1,
          name: 'Michael Brown',
          email: 'michael@example.com',
          phone: '123-456-7890',
          date: new Date().toISOString(),
          projectType: 'Kitchen Remodeling',
          requirements: 'Looking to upgrade my kitchen with modern appliances and a new layout.',
          status: 'pending',
          address: '123 Main St',
          createdAt: new Date().toISOString()
        }
      ]);
    }
    
    // Handle creating new consultation
    if (path === '/consultations' && req.method === 'POST') {
      try {
        let body = req.body;
        if (typeof body === 'string') {
          body = JSON.parse(body);
        }
        
        // Just return success with the submitted data
        return res.status(201).json({
          id: 999,
          ...body,
          status: 'pending',
          createdAt: new Date().toISOString()
        });
      } catch (error) {
        return res.status(400).json({ error: 'Invalid request' });
      }
    }
    
    // Default response for unknown paths
    return res.status(404).json({ 
      error: 'Not found',
      path,
      message: 'This is a mock API response. The real database integration is disabled.'
    });
    
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  }
}
