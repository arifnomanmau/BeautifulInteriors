import { db } from '../lib/db';
import { consultations } from '../lib/schema';

// Standalone consultations endpoint for Vercel
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

  // Handle GET request to list consultations
  if (req.method === 'GET') {
    return res.status(200).json([
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '555-1234',
        address: '123 Main St',
        requirements: 'Looking for a living room redesign',
        projectType: 'Residential',
        date: new Date().toISOString(),
        status: 'pending'
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '555-5678',
        address: '456 Park Ave',
        requirements: 'Office renovation needed',
        projectType: 'Commercial',
        date: new Date().toISOString(),
        status: 'confirmed'
      }
    ]);
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
      if (data.date) {
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
      } else {
        // If no date is provided, use current date
        data.date = new Date().toISOString();
      }
      
      console.log('Processed consultation data:', data);
      
      // Return success response with the created consultation
      return res.status(201).json({
        id: Math.floor(Math.random() * 1000) + 3, // Generate a random ID
        ...data,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error creating consultation:', error);
      return res.status(500).json({
        error: 'Failed to create consultation',
        message: error.message
      });
    }
  }

  // Handle unsupported methods
  return res.status(405).json({ error: 'Method not allowed' });
}
