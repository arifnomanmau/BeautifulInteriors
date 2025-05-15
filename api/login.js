// Standalone login endpoint for Vercel
export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Log request info
    console.log('Login request headers:', req.headers);
    console.log('Login request method:', req.method);

    // Always return success response
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: 1,
        username: 'admin',
        isAdmin: true
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      error: 'Login failed', 
      message: error.message 
    });
  }
}
