// index.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the client directory
app.use(express.static(path.join(__dirname, 'client')));

// Serve static files from public directory if it exists
app.use(express.static(path.join(__dirname, 'public')));

// For any other route, serve the index.html file
app.get('*', (req, res) => {
  // Don't interfere with API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).send('API route not found');
  }
  
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

// Start the server if not running as a serverless function
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export the Express app for serverless environments
export default app;