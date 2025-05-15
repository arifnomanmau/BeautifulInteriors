window.API_RESPONSES = {
  '/api/login': {
    success: true,
    message: 'Login successful',
    user: {
      id: 1,
      username: 'admin',
      isAdmin: true
    }
  },
  '/api/portfolio': [
    {
      id: 1,
      title: 'Modern Living Room',
      description: 'A contemporary living room design with clean lines and neutral colors.',
      imageUrl: 'https://images.unsplash.com/photo-1600210492493-0946911123ea',
      category: 'Living Room',
      featured: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      title: 'Elegant Bedroom',
      description: 'Luxurious bedroom with soft textures and calming colors.',
      imageUrl: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0',
      category: 'Bedroom',
      featured: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 3,
      title: 'Minimalist Kitchen',
      description: 'Clean and functional kitchen design with modern appliances.',
      imageUrl: 'https://images.unsplash.com/photo-1556911220-bff31c812dba',
      category: 'Kitchen',
      featured: false,
      createdAt: new Date().toISOString()
    }
  ]
};
