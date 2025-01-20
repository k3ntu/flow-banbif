const express = require('express');
const cors = require('cors');
const app = express();
const axios = require('axios');

const path = require('path');

app.use(cors());

app.use(express.json());

app.post('/proxy/token', async (req, res) => {
  try {
    const payload = JSON.stringify({
      grant_type: 'client_credentials',
      client_id: 'y2yilxnvkm55c3nyd3u2w9sz',
      client_secret: 'V3Kc7difTRz3E1Y4Shg2n0cM'
    });

    const response = await axios.post('https://mc2nqjmlyhcbf2cz3s0c61126mn8.auth.marketingcloudapis.com/v2/token',
      payload,
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { message: 'Error' });
  }
});

app.post('/interaction/v1/events', async (req, res) => {
  try {
    const { authorization } = req.headers;

    const response = await axios.post('https://mc2nqjmlyhcbf2cz3s0c61126mn8.rest.marketingcloudapis.com/interaction/v1/events', req.body, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authorization
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { message: 'Error' });
  }
});


app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/pages/index.html'));
});

app.get('/verification', (req, res) => {
  res.sendFile(path.join(__dirname, '/pages/verification/index.html'));
});

app.listen(3000, () => console.log('Proxy server running on http://localhost:3000'));
