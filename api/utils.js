import fs from 'fs';
import path from 'path';

// File path to store data
const DATA_FILE = path.join(process.cwd(), 'data.json');

// Default data if file doesn't exist
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

// Load data from file or create default data
export function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
      return data;
    }
  } catch (error) {
    console.error('Error loading data file:', error);
  }
  
  // If file doesn't exist or there's an error, return default data
  return DEFAULT_DATA;
}

// Save data to file
export function saveData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving data file:', error);
    return false;
  }
}

// Get global data store or create it
export function getDataStore() {
  if (typeof global._dataStore === 'undefined') {
    // Initialize with data from file
    global._dataStore = loadData();
  }
  return global._dataStore;
}

// Save current global data store to file
export function persistDataStore() {
  if (typeof global._dataStore !== 'undefined') {
    return saveData(global._dataStore);
  }
  return false;
} 