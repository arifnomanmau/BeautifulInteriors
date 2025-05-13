export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Log request details
  console.log('Login test request:', {
    method: req.method,
    headers: req.headers,
    body: req.body,
    query: req.query
  });
  
  // Return a test user response
  return res.status(200).json({
    success: true,
    message: 'Login test successful',
    user: {
      id: 1,
      username: 'testadmin',
      isAdmin: true
    }
  });
} 