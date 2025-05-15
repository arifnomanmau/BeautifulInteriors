// Standalone consultations endpoint for Vercel

// Default data to initialize with
const DEFAULT_CONSULTATIONS = [
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
];

// Create a global variable to store data between requests in the same instance
if (typeof global._dataStore === 'undefined') {
  global._dataStore = { consultations: [...DEFAULT_CONSULTATIONS] };
  console.log('Initialized global data store with default consultations');
}

// Get the data store
const dataStore = global._dataStore;

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Initialize consultations if it doesn't exist
  if (!dataStore.consultations) {
    dataStore.consultations = [...DEFAULT_CONSULTATIONS];
  }

  // Handle GET request to list consultations
  if (req.method === 'GET') {
    return res.status(200).json(dataStore.consultations);
  }

  // Handle POST request to create a new consultation
  if (req.method === 'POST') {
    try {
      // Log the received data and headers
      console.log('Request headers:', req.headers);
      console.log('Received consultation data (raw):', req.body);
      
      // Parse request body if it's a string
      let data = req.body;
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
          console.log('Parsed body:', data);
        } catch (e) {
          console.error('Failed to parse request body:', e);
        }
      }
      
      // Ensure date field is properly formatted
      if (data && data.date) {
        // If date is already an ISO string, keep it as is
        if (typeof data.date !== 'string') {
          try {
            // Try to parse as date if it's not a string
            data.date = new Date(data.date).toISOString();
          } catch (e) {
            console.error('Error converting date:', e);
            // Fall back to current date
            data.date = new Date().toISOString();
          }
        }
      } else if (data) {
        // If no date is provided, use current date
        data.date = new Date().toISOString();
      } else {
        // If data is null or undefined, create an empty object
        data = { date: new Date().toISOString() };
      }
      
      console.log('Processed consultation data:', data);
      
      // Create new consultation and add to dataStore
      const newId = Math.max(...dataStore.consultations.map(item => item.id || 0), 0) + 1;
      const newConsultation = {
        id: newId,
        ...data,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      
      dataStore.consultations.push(newConsultation);
      
      console.log(`Added new consultation (ID: ${newId}). Total count: ${dataStore.consultations.length}`);
      
      // Return success response with the created consultation
      return res.status(201).json(newConsultation);
    } catch (error) {
      console.error('Error creating consultation:', error);
      return res.status(500).json({
        error: 'Failed to create consultation',
        message: error.message,
        instanceId: process.env.AWS_LAMBDA_FUNCTION_NAME || 'local'
      });
    }
  }

  // Handle unsupported methods
  return res.status(405).json({ error: 'Method not allowed' });
}
