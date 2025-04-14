const express = require('express');
const { Client } = require('@elastic/elasticsearch');

const app = express();
const port = 3000;

// Elasticsearch client setup
const client = new Client({ node: 'http://localhost:9200' });

// Search endpoint
app.get('/search', async (req, res) => {
  try {
    const query = req.query.q || ''; // Get query string from the request
    const response = await client.search({
      index: 'products',
      body: {
        query: {
          multi_match: {
            query: query,
            fields: ['name^3', 'description', 'category', 'price'],
          },
        },
      },
    });

    // Log the response to check its structure
    console.log('Elasticsearch response:', response.body);

    if (response.body.hits && response.body.hits.hits.length > 0) {
      return res.json(response.body.hits.hits);
    } else {
      return res.status(404).json({ message: 'No results found' });
    }
  } catch (error) {
    console.error('Elasticsearch error:', error);
    return res.status(500).json({ error: 'An error occurred while searching' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Search API running at http://localhost:${port}`);
});
