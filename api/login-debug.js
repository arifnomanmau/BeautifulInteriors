export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  console.log('Login debug request received:', req.method);
  
  // For GET requests, return a test form
  if (req.method === 'GET') {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Login Debug</title>
        <style>
          body { font-family: Arial; max-width: 500px; margin: 0 auto; padding: 20px; }
          button { padding: 10px; }
          pre { background: #f4f4f4; padding: 10px; }
        </style>
      </head>
      <body>
        <h1>Login Debug</h1>
        <form id="loginForm">
          <div>
            <label>Username: <input name="username" value="admin" /></label>
          </div>
          <div>
            <label>Password: <input name="password" type="password" value="admin123" /></label>
          </div>
          <button type="submit">Test Login</button>
        </form>
        <div id="result"></div>
        
        <script>
          document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const form = e.target;
            const username = form.username.value;
            const password = form.password.value;
            const resultDiv = document.getElementById('result');
            
            resultDiv.innerHTML = 'Testing...';
            
            try {
              const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
              });
              
              const data = await response.json();
              resultDiv.innerHTML = '<h3>Response:</h3><pre>' + JSON.stringify(data, null, 2) + '</pre>';
            } catch (error) {
              resultDiv.innerHTML = '<h3>Error:</h3><pre>' + error.message + '</pre>';
            }
          });
        </script>
      </body>
      </html>
    `;
    
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(html);
  }
  
  // For POST requests, return a hardcoded successful response
  if (req.method === 'POST') {
    return res.status(200).json({
      success: true,
      message: 'Login debug successful',
      user: {
        id: 1,
        username: 'admin',
        isAdmin: true
      },
      requestBody: req.body,
      headers: req.headers
    });
  }
  
  // Default response
  res.status(405).json({ error: 'Method not allowed' });
} 