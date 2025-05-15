// API endpoint to provide information about the current serverless instance
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

  // Generate a random ID for this instance if it doesn't exist
  if (!global._instanceId) {
    global._instanceId = Math.random().toString(36).substring(2, 10);
    global._instanceCreatedAt = new Date().toISOString();
    global._requestCount = 0;
  }

  global._requestCount++;

  // Return information about this serverless instance
  return res.status(200).json({
    instanceId: global._instanceId,
    functionName: process.env.AWS_LAMBDA_FUNCTION_NAME || 'local',
    createdAt: global._instanceCreatedAt,
    requestCount: global._requestCount,
    memoryUsage: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development',
    currentTime: new Date().toISOString(),
    hasDataStore: typeof global._dataStore !== 'undefined',
    dataStats: global._dataStore ? {
      portfolioItems: (global._dataStore.portfolioItems || []).length,
      testimonials: (global._dataStore.testimonials || []).length,
      consultations: (global._dataStore.consultations || []).length
    } : null
  });
} 