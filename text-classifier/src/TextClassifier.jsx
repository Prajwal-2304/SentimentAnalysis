import React, { useState } from 'react';
import axios from 'axios';
import './TextClassifier.css'; 

const TextClassifier = () => {
  const [texts, setTexts] = useState('');
  const [result, setResult] = useState({ positive: [], neutral: [], negative: [] });
  const [loading, setLoading] = useState(false); 

  const handleChange = (e) => {
    setTexts(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setResult({ positive: [], neutral: [], negative: [] });
    setLoading(true);

    const textArray = texts.split('\n');
    try {
      const response = await axios.post('http://127.0.0.1:5000/classify', { texts: textArray });
      setResult(response.data);
    } catch (error) {
      console.error('Error classifying texts:', error);
    } finally {
     
      setLoading(false);
    }
  };

  return (
    <div className="text-classifier">
      <h1>Text Classifier</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={texts}
          onChange={handleChange}
          rows="10"
          placeholder="Enter texts to classify, one per line"
        ></textarea>
        <br />
        <button type="submit">Classify</button>
      </form>
      {loading && (
        <div className="loading">
          <p>Loading...</p> 
        </div>
      )}
      <div className="results">
        <h2>Results</h2>
        <div className="result-columns">
          {result.positive.length > 0 && (
            <div className="result-column">
              <h3 className="positive">Positive</h3>
              <ul>
                {result.positive.map((text, index) => (
                  <li key={index}>{text}</li>
                ))}
              </ul>
            </div>
          )}
          {result.neutral.length > 0 && (
            <div className="result-column">
              <h3 className="neutral">Neutral</h3>
              <ul>
                {result.neutral.map((text, index) => (
                  <li key={index}>{text}</li>
                ))}
              </ul>
            </div>
          )}
          {result.negative.length > 0 && (
            <div className="result-column">
              <h3 className="negative">Negative</h3>
              <ul>
                {result.negative.map((text, index) => (
                  <li key={index}>{text}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextClassifier;
