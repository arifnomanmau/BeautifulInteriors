// Debug endpoint to check the global data store
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

  // Return the current state of the data store
  return res.status(200).json({
    hasGlobalStore: typeof global._dataStore !== 'undefined',
    data: global._dataStore || {},
    serverInstance: Math.random().toString(36).substring(7), // Unique ID to identify server instance
    timestamp: new Date().toISOString()
  });
} 