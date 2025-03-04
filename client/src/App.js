import React, { useState } from 'react';
import AssignmentForm from './components/AssignmentForm';
import ResultDisplay from './components/ResultDisplay';

function App() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateAssignment = async (formData) => {
    setLoading(true);
    setError('');
    setResult('');
    
    // Validate formData to ensure no undefined values
    if (!formData.writingSample || !formData.assignmentPrompt) {
      setError('Please provide both a writing sample and assignment prompt');
      setLoading(false);
      return;
    }
    
    // Set empty string for undefined values
    const sanitizedData = {
      writingSample: formData.writingSample || '',
      assignmentPrompt: formData.assignmentPrompt || '',
      materials: formData.materials || ''
    };
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sanitizedData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `Server error: ${response.status}`);
      }
      
      setResult(data.text || data.generatedText || '');
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'An error occurred while generating the assignment. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>AssignMate</h1>
        <p>Generate assignment responses in your own writing style</p>
        <p className="api-info">(Powered by Hugging Face)</p>
      </header>
      
      <main>
        <AssignmentForm 
          onSubmit={handleGenerateAssignment} 
          loading={loading} 
        />
        
        {error && (
          <div className="card error">
            <p><strong>Error:</strong> {error}</p>
            <p>Make sure the server is running and the Hugging Face API key is correctly configured.</p>
          </div>
        )}
        
        {result && !loading && (
          <ResultDisplay result={result} />
        )}
      </main>
      
      <footer>
        <p>&copy; {new Date().getFullYear()} AssignMate - All rights reserved</p>
      </footer>
    </div>
  );
}

export default App; 