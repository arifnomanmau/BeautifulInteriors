import { db } from '../lib/db';
import { portfolioItems, testimonials, consultations, users } from '../lib/schema';
import { eq, sql } from 'drizzle-orm';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Get the path from the URL
  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname.replace(/^\/api/, '');
  
  // Route to the appropriate handler
  try {
    if (path === '/ping') {
      return pingHandler(req, res);
    } else if (path === '/login') {
      return await loginHandler(req, res);
    } else if (path === '/logout') {
      return await logoutHandler(req, res);
    } else if (path === '/user') {
      return await userHandler(req, res);
    } else if (path === '/register') {
      return await registerHandler(req, res);
    } else if (path.startsWith('/portfolio')) {
      return await portfolioHandler(req, res, path);
    } else if (path.startsWith('/testimonials')) {
      return await testimonialsHandler(req, res, path);
    } else if (path.startsWith('/consultations')) {
      return await consultationsHandler(req, res, path);
    } else {
      res.status(404).json({ error: 'Not found', path });
    }
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}

// Simple ping handler
function pingHandler(req, res) {
  res.status(200).json({
    status: 'ok', 
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
}

// Login handler
async function loginHandler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Parse request body if needed
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid JSON in request body' });
    }
  }

  const { username, password } = body || {};
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    // For testing/development
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
    }

    // Use database lookup
    const rawResult = await db.execute(
      'SELECT id, username, password, is_admin FROM users WHERE username = $1 LIMIT 1',
      [username]
    );
    
    if (!rawResult || !Array.isArray(rawResult) || rawResult.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    
    const user = rawResult[0];

    if (password !== user.password) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        isAdmin: user.is_admin
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Login failed: ' + (error.message || 'Unknown error')
    });
  }
}

// User handler
async function userHandler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // For testing/development
  return res.status(200).json({
    id: 1,
    username: 'admin',
    isAdmin: true
  });
}

// Logout handler
async function logoutHandler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  return res.status(200).json({ success: true });
}

// Register handler
async function registerHandler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, password, isAdmin } = req.body;

  try {
    const result = await db.execute(
      'INSERT INTO users (username, password, is_admin) VALUES ($1, $2, $3) RETURNING id, username, is_admin',
      [username, password, isAdmin || false]
    );

    return res.status(201).json(result[0]);
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Failed to create user: ' + error.message });
  }
}

// Portfolio handler
async function portfolioHandler(req, res, path) {
  // Extract ID if present in the path (format: /portfolio/123)
  const segments = path.split('/').filter(Boolean);
  const id = segments.length > 1 ? parseInt(segments[1]) : null;
  
  if (!id) {
    // Handle collection requests (/portfolio)
    if (req.method === 'GET') {
      try {
        const items = await db.execute('SELECT * FROM portfolio_items');
        res.status(200).json(items);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch portfolio items' });
      }
    } else if (req.method === 'POST') {
      try {
        const { title, description, imageUrl, category, featured } = req.body;
        const result = await db.execute(
          'INSERT INTO portfolio_items (title, description, image_url, category, featured) VALUES ($1, $2, $3, $4, $5) RETURNING *',
          [title, description, imageUrl, category, featured || false]
        );
        res.status(201).json(result[0]);
      } catch (error) {
        res.status(500).json({ error: 'Failed to create portfolio item' });
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } else {
    // Handle individual item requests (/portfolio/123)
    if (req.method === 'GET') {
      try {
        const result = await db.execute('SELECT * FROM portfolio_items WHERE id = $1', [id]);
        if (!result || result.length === 0) {
          return res.status(404).json({ error: 'Portfolio item not found' });
        }
        res.status(200).json(result[0]);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch portfolio item' });
      }
    } else if (req.method === 'PATCH') {
      try {
        const updates = [];
        const values = [];
        let paramCount = 1;
        
        // Build dynamic SET clause
        if (req.body.title !== undefined) {
          updates.push(`title = $${paramCount++}`);
          values.push(req.body.title);
        }
        if (req.body.description !== undefined) {
          updates.push(`description = $${paramCount++}`);
          values.push(req.body.description);
        }
        if (req.body.imageUrl !== undefined) {
          updates.push(`image_url = $${paramCount++}`);
          values.push(req.body.imageUrl);
        }
        if (req.body.category !== undefined) {
          updates.push(`category = $${paramCount++}`);
          values.push(req.body.category);
        }
        if (req.body.featured !== undefined) {
          updates.push(`featured = $${paramCount++}`);
          values.push(req.body.featured);
        }
        
        // Add ID as the last parameter
        values.push(id);
        
        const result = await db.execute(
          `UPDATE portfolio_items SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
          values
        );
        
        if (!result || result.length === 0) {
          return res.status(404).json({ error: 'Portfolio item not found' });
        }
        
        res.status(200).json(result[0]);
      } catch (error) {
        res.status(500).json({ error: 'Failed to update portfolio item' });
      }
    } else if (req.method === 'DELETE') {
      try {
        const result = await db.execute(
          'DELETE FROM portfolio_items WHERE id = $1 RETURNING id',
          [id]
        );
        
        if (!result || result.length === 0) {
          return res.status(404).json({ error: 'Portfolio item not found' });
        }
        
        res.status(200).json({ success: true });
      } catch (error) {
        res.status(500).json({ error: 'Failed to delete portfolio item' });
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  }
}

// Testimonials handler
async function testimonialsHandler(req, res, path) {
  const segments = path.split('/').filter(Boolean);
  const id = segments.length > 1 ? parseInt(segments[1]) : null;
  
  if (!id) {
    // Handle collection requests (/testimonials)
    if (req.method === 'GET') {
      try {
        const items = await db.execute('SELECT * FROM testimonials');
        res.status(200).json(items);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch testimonials' });
      }
    } else if (req.method === 'POST') {
      try {
        const { name, role, content, imageUrl } = req.body;
        const result = await db.execute(
          'INSERT INTO testimonials (name, role, content, image_url) VALUES ($1, $2, $3, $4) RETURNING *',
          [name, role, content, imageUrl]
        );
        res.status(201).json(result[0]);
      } catch (error) {
        res.status(500).json({ error: 'Failed to create testimonial' });
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } else {
    // Handle individual item requests (/testimonials/123)
    if (req.method === 'DELETE') {
      try {
        const result = await db.execute(
          'DELETE FROM testimonials WHERE id = $1 RETURNING id',
          [id]
        );
        
        if (!result || result.length === 0) {
          return res.status(404).json({ error: 'Testimonial not found' });
        }
        
        res.status(200).json({ success: true });
      } catch (error) {
        res.status(500).json({ error: 'Failed to delete testimonial' });
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  }
}

// Consultations handler
async function consultationsHandler(req, res, path) {
  const segments = path.split('/').filter(Boolean);
  const id = segments.length > 1 ? parseInt(segments[1]) : null;
  
  if (!id) {
    // Handle collection requests (/consultations)
    if (req.method === 'GET') {
      try {
        const items = await db.execute('SELECT * FROM consultations');
        res.status(200).json(items);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch consultations' });
      }
    } else if (req.method === 'POST') {
      try {
        const { name, email, phone, date, projectType, requirements, address, budget, preferredContactTime } = req.body;
        
        const result = await db.execute(
          `INSERT INTO consultations 
           (name, email, phone, date, project_type, requirements, address, budget, preferred_contact_time)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
          [name, email, phone, date, projectType, requirements, address, budget, preferredContactTime]
        );
        
        res.status(201).json(result[0]);
      } catch (error) {
        res.status(500).json({ error: 'Failed to create consultation' });
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } else {
    // Handle individual item requests (/consultations/123)
    if (req.method === 'PATCH') {
      try {
        const { status, notes } = req.body;
        const updates = [];
        const values = [];
        let paramCount = 1;
        
        if (status !== undefined) {
          updates.push(`status = $${paramCount++}`);
          values.push(status);
        }
        if (notes !== undefined) {
          updates.push(`notes = $${paramCount++}`);
          values.push(notes);
        }
        
        // Add ID as the last parameter
        values.push(id);
        
        const result = await db.execute(
          `UPDATE consultations SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
          values
        );
        
        if (!result || result.length === 0) {
          return res.status(404).json({ error: 'Consultation not found' });
        }
        
        res.status(200).json(result[0]);
      } catch (error) {
        res.status(500).json({ error: 'Failed to update consultation' });
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  }
}
