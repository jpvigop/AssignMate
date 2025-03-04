import React, { useState } from 'react';

const ResultDisplay = ({ result }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setIsCopied(true);
    
    // Reset the "Copied" message after 2 seconds
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <div className="card result-display">
      <div className="result-header">
        <div>
          <h2>Generated Assignment</h2>
          <button 
            onClick={() => setShowInfo(!showInfo)} 
            className="info-button"
          >
            {showInfo ? 'Hide Info' : 'How Was This Created?'}
          </button>
        </div>
        <button 
          onClick={handleCopy} 
          className="copy-button"
        >
          {isCopied ? 'Copied!' : 'Copy to Clipboard'}
        </button>
      </div>
      
      {showInfo && (
        <div className="info-panel">
          <h3>About Your Generated Assignment</h3>
          <p>This content was created by analyzing your writing sample to capture your unique style patterns, including:</p>
          <ul>
            <li>Sentence length and complexity patterns</li>
            <li>Vocabulary preferences and word choice tendencies</li>
            <li>Paragraph structure and organization habits</li>
            <li>Punctuation usage and formatting preferences</li>
            <li>Your natural writing quirks and idiosyncrasies</li>
          </ul>
          
          <h4>Course Material Integration</h4>
          <p>The system intelligently processes your course materials to extract and incorporate:</p>
          <ul>
            <li><strong>Key terminology</strong> - Important subject-specific terms and concepts</li>
            <li><strong>Definitions</strong> - Formal explanations of relevant concepts</li>
            <li><strong>Numerical data</strong> - Statistics, percentages, dates, and other factual evidence</li>
            <li><strong>Quotable content</strong> - Important statements that reinforce key points</li>
            <li><strong>Examples & case studies</strong> - Illustrative scenarios from your materials</li>
          </ul>
          
          <p>The system then applied your personal writing style to this academic content, creating a response that sounds like <em>you</em> wrote it while accurately addressing the assignment requirements.</p>
          <p><strong>Important:</strong> Always review and edit the generated content to ensure accuracy and make any necessary adjustments before submitting.</p>
        </div>
      )}
      
      <div className="result-content">
        {result.split('\n').map((paragraph, index) => (
          paragraph ? <p key={index}>{paragraph}</p> : <br key={index} />
        ))}
      </div>
    </div>
  );
};

export default ResultDisplay; 