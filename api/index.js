// Consolidated API handler for all endpoints

// Default data to initialize with
const DEFAULT_DATA = {
  portfolioItems: [
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
  ],
  testimonials: [
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
  ],
  consultations: [
    {
      id: 1,
      name: 'Michael Johnson',
      email: 'michael@example.com',
      phone: '555-1234',
      date: new Date().toISOString(),
      projectType: 'Home Renovation',
      requirements: 'Looking to renovate my living room',
      status: 'pending'
    },
    {
      id: 2,
      name: 'Sarah Williams',
      email: 'sarah@example.com',
      phone: '555-5678',
      date: new Date().toISOString(),
      projectType: 'Office Design',
      requirements: 'Need help designing our new office space',
      status: 'confirmed'
    }
  ]
};

// Create a global variable to store data between requests in the same instance
if (typeof global._dataStore === 'undefined') {
  global._dataStore = { ...DEFAULT_DATA };
  console.log('Initialized global data store with default data');
}

// Get the data store
const dataStore = global._dataStore;

// Generate a random instance ID for debugging
if (!global._instanceId) {
  global._instanceId = Math.random().toString(36).substring(2, 10);
  global._instanceCreatedAt = new Date().toISOString();
  global._requestCount = 0;
}

export default async function handler(req, res) {
  // Count requests for debugging
  global._requestCount = (global._requestCount || 0) + 1;

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
    console.log(`API request #${global._requestCount} to: ${path}, Method: ${req.method}, Instance: ${global._instanceId}`);
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
        instanceId: global._instanceId,
        timestamp: new Date().toISOString()
      });
    }
    
    // Debug endpoint to check data store state
    if (path === '/debug-store') {
      return res.status(200).json({
        instanceId: global._instanceId,
        createdAt: global._instanceCreatedAt,
        requestCount: global._requestCount,
        hasDataStore: typeof global._dataStore !== 'undefined',
        portfolioItemsCount: (dataStore.portfolioItems || []).length,
        testimonialsCount: (dataStore.testimonials || []).length,
        consultationsCount: (dataStore.consultations || []).length,
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
          // Return all portfolio items from data store
          return res.status(200).json(dataStore.portfolioItems || []);
        } else if (req.method === 'POST') {
          // Create a new portfolio item
          let data = req.body;
          if (typeof data === 'string') {
            try {
              data = JSON.parse(data);
            } catch (e) {
              console.error('Failed to parse request body:', e);
            }
          }
          
          // Make sure portfolioItems exists
          if (!dataStore.portfolioItems) {
            dataStore.portfolioItems = [];
          }
          
          const newId = Math.max(...dataStore.portfolioItems.map(item => item.id || 0), 0) + 1;
          const newItem = {
            id: newId,
            ...data,
            createdAt: new Date().toISOString()
          };
          dataStore.portfolioItems.push(newItem);
          
          return res.status(201).json(newItem);
        }
      } else {
        // Make sure portfolioItems exists
        if (!dataStore.portfolioItems) {
          dataStore.portfolioItems = [];
        }
        
        // Find the portfolio item
        const itemIndex = dataStore.portfolioItems.findIndex(item => item.id === id);
        const item = itemIndex >= 0 ? dataStore.portfolioItems[itemIndex] : null;
        
        // Single item endpoint
        if (req.method === 'GET') {
          if (!item) {
            return res.status(404).json({ error: 'Portfolio item not found' });
          }
          return res.status(200).json(item);
        } else if (req.method === 'PATCH') {
          if (!item) {
            return res.status(404).json({ error: 'Portfolio item not found' });
          }
          
          let data = req.body;
          if (typeof data === 'string') {
            try {
              data = JSON.parse(data);
            } catch (e) {
              console.error('Failed to parse request body:', e);
            }
          }
          
          const updatedItem = {
            ...item,
            ...data,
            id: id // Ensure ID doesn't change
          };
          dataStore.portfolioItems[itemIndex] = updatedItem;
          
          return res.status(200).json(updatedItem);
        } else if (req.method === 'DELETE') {
          if (!item) {
            return res.status(404).json({ error: 'Portfolio item not found' });
          }
          
          dataStore.portfolioItems = dataStore.portfolioItems.filter(item => item.id !== id);
          
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
          // Make sure testimonials exists
          if (!dataStore.testimonials) {
            dataStore.testimonials = [];
          }
          
          // Return all testimonials from data store
          return res.status(200).json(dataStore.testimonials);
        } else if (req.method === 'POST') {
          // Create a new testimonial
          let data = req.body;
          if (typeof data === 'string') {
            try {
              data = JSON.parse(data);
            } catch (e) {
              console.error('Failed to parse request body:', e);
            }
          }
          
          // Make sure testimonials exists
          if (!dataStore.testimonials) {
            dataStore.testimonials = [];
          }
          
          const newId = Math.max(...dataStore.testimonials.map(item => item.id || 0), 0) + 1;
          const newTestimonial = {
            id: newId,
            ...data,
            createdAt: new Date().toISOString()
          };
          dataStore.testimonials.push(newTestimonial);
          
          return res.status(201).json(newTestimonial);
        }
      } else {
        // Make sure testimonials exists
        if (!dataStore.testimonials) {
          dataStore.testimonials = [];
        }
        
        // Find the testimonial
        const itemIndex = dataStore.testimonials.findIndex(item => item.id === id);
        const item = itemIndex >= 0 ? dataStore.testimonials[itemIndex] : null;
        
        // Single testimonial endpoint
        if (req.method === 'GET') {
          if (!item) {
            return res.status(404).json({ error: 'Testimonial not found' });
          }
          return res.status(200).json(item);
        } else if (req.method === 'PATCH') {
          if (!item) {
            return res.status(404).json({ error: 'Testimonial not found' });
          }
          
          let data = req.body;
          if (typeof data === 'string') {
            try {
              data = JSON.parse(data);
            } catch (e) {
              console.error('Failed to parse request body:', e);
            }
          }
          
          const updatedItem = {
            ...item,
            ...data,
            id: id // Ensure ID doesn't change
          };
          dataStore.testimonials[itemIndex] = updatedItem;
          
          return res.status(200).json(updatedItem);
        } else if (req.method === 'DELETE') {
          if (!item) {
            return res.status(404).json({ error: 'Testimonial not found' });
          }
          
          dataStore.testimonials = dataStore.testimonials.filter(item => item.id !== id);
          
          return res.status(200).json({
            id: id,
            deleted: true
          });
        }
      }
    }
    
    // Consultations endpoints (for both contact form submissions and bookings)
    if (path.startsWith('/consultations')) {
      const segments = path.split('/').filter(Boolean);
      const id = segments.length > 1 ? parseInt(segments[1]) : null;
      const action = segments.length > 2 ? segments[2] : null;
      
      // Collection endpoint
      if (!id) {
        if (req.method === 'GET') {
          // Make sure consultations exists
          if (!dataStore.consultations) {
            dataStore.consultations = [];
          }
          
          // Return all consultations from data store
          return res.status(200).json(dataStore.consultations);
        } else if (req.method === 'POST') {
          // Create a new consultation
          let data = req.body;
          if (typeof data === 'string') {
            try {
              data = JSON.parse(data);
            } catch (e) {
              console.error('Failed to parse request body:', e);
            }
          }
          
          // Process date if needed
          if (data && data.date) {
            // If date is already an ISO string, keep it as is
            if (typeof data.date !== 'string') {
              try {
                // Try to parse as date if it's not a string
                data.date = new Date(data.date).toISOString();
              } catch (e) {
                console.error('Error converting date:', e);
                data.date = new Date().toISOString();
              }
            }
          } else if (data) {
            // If no date is provided, use current date
            data.date = new Date().toISOString();
          }
          
          // Make sure consultations exists
          if (!dataStore.consultations) {
            dataStore.consultations = [];
          }
          
          const newId = Math.max(...dataStore.consultations.map(item => item.id || 0), 0) + 1;
          const newConsultation = {
            id: newId,
            ...data,
            status: 'pending',
            createdAt: new Date().toISOString()
          };
          dataStore.consultations.push(newConsultation);
          
          return res.status(201).json(newConsultation);
        }
      } else {
        // Make sure consultations exists
        if (!dataStore.consultations) {
          dataStore.consultations = [];
        }
        
        // Find the consultation
        const itemIndex = dataStore.consultations.findIndex(item => item.id === id);
        const item = itemIndex >= 0 ? dataStore.consultations[itemIndex] : null;
        
        if (!item) {
          return res.status(404).json({ error: 'Consultation not found' });
        }
        
        // Handle status update
        if (action === 'status' && req.method === 'PATCH') {
          let data = req.body;
          if (typeof data === 'string') {
            try {
              data = JSON.parse(data);
            } catch (e) {
              console.error('Failed to parse request body:', e);
            }
          }
          
          const updatedItem = {
            ...item,
            status: data.status
          };
          dataStore.consultations[itemIndex] = updatedItem;
          return res.status(200).json(updatedItem);
        }
        
        // Handle notes update
        if (action === 'notes' && req.method === 'PATCH') {
          let data = req.body;
          if (typeof data === 'string') {
            try {
              data = JSON.parse(data);
            } catch (e) {
              console.error('Failed to parse request body:', e);
            }
          }
          
          const updatedItem = {
            ...item,
            notes: data.notes
          };
          dataStore.consultations[itemIndex] = updatedItem;
          return res.status(200).json(updatedItem);
        }
        
        // Single consultation endpoint
        if (req.method === 'GET') {
          return res.status(200).json(item);
        } else if (req.method === 'PATCH') {
          let data = req.body;
          if (typeof data === 'string') {
            try {
              data = JSON.parse(data);
            } catch (e) {
              console.error('Failed to parse request body:', e);
            }
          }
          
          const updatedItem = {
            ...item,
            ...data,
            id: id // Ensure ID doesn't change
          };
          dataStore.consultations[itemIndex] = updatedItem;
          
          return res.status(200).json(updatedItem);
        } else if (req.method === 'DELETE') {
          dataStore.consultations = dataStore.consultations.filter(item => item.id !== id);
          
          return res.status(200).json({
            id: id,
            deleted: true
          });
        }
      }
    }
    
    // Handle 404 for unmatched routes
    return res.status(404).json({ 
      error: 'Not found', 
      path: path, 
      instanceId: global._instanceId 
    });
    
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message,
      instanceId: global._instanceId 
    });
  }
}
