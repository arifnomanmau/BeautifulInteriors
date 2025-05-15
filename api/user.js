// Standalone user endpoint for Vercel
export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Return hardcoded user
    return res.status(200).json({
      id: 1,
      username: 'admin',
      isAdmin: true
    });
  } catch (error) {
    console.error('User endpoint error:', error);
    return res.status(500).json({ 
      error: 'Failed to retrieve user', 
      message: error.message 
    });
  }
} 