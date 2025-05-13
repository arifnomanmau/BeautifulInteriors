import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function DirectLoginTest() {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  const testLogin = async () => {
    try {
      setError(null);
      setResult(null);
      
      // Try direct fetch to login endpoint
      const response = await fetch('/api/login-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'admin', password: 'admin123' })
      });
      
      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    }
  };
  
  return (
    <div className="mt-4 p-4 border rounded">
      <h3 className="font-bold">Direct Login Test</h3>
      <Button onClick={testLogin} className="mt-2">Test Login API</Button>
      
      {error && (
        <div className="mt-2 p-2 bg-red-100 text-red-800 rounded">
          <p>Error: {error}</p>
        </div>
      )}
      
      {result && (
        <div className="mt-2 p-2 bg-green-100 text-green-800 rounded">
          <pre className="text-xs overflow-auto">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
} 