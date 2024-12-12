const express = require('express');
const AWS = require('aws-sdk');

// AWS SDK and Comprehend Client Configuration
// AWS Region Configuration
AWS.config.update({ region: 'eu-central-1' });
const comprehend = new AWS.Comprehend();

const app = express();
const port = 3000;

// Sentiment Analysis Endpoint (GET Request
app.get('/analyze', async (req, res) => {
  // Retrieve 'text' from Query Parameters
  const text = req.query.text;

  // Text Validation
  if (!text || text.trim() === '') {
    return res.status(400).json({ error: 'Text parameter is required.' });
  }

  // Comprehend Request Parameters
  const params = {
    Text: text,
    LanguageCode: 'en', // Sentiment Analysis Language (e.g., 'en' for English)
  };

  try {
    // Comprehend Sentiment Analysis Invocation
    const result = await comprehend.detectSentiment(params).promise();

    // Return Results
    res.json({
      text,
      sentiment: result.Sentiment,
      sentimentScores: result.SentimentScore,
    });
  } catch (error) {
    // Error Handling
    console.error('Error calling Comprehend:', error);
    res.status(500).json({ error: 'Failed to analyze sentiment.' });
  }
});

// Server Initialization
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});