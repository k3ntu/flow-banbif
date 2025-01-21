const express = require('express');
const cors = require('cors');
const app = express();
const axios = require('axios');

const path = require('path');
const config = require('./config')
const { sfmc } = config;

app.use(cors());

app.use(express.json());

app.post('/proxy/token', async (req, res) => {
  try {
    const payload = JSON.stringify({
      grant_type: sfmc.grant_type,
      client_id: sfmc.client_id,
      client_secret: sfmc.client_id
    });

    const response = await axios.post(`${sfmc.host}/v2/token`,
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

    const response = await axios.post(`${sfmc.host}/interaction/v1/events`, req.body, {
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

app.get('/verification/another', (req, res) => {
  res.sendFile(path.join(__dirname, '/pages/verification/another.html'));
});

app.listen(3000, () => console.log(`Proxy server running on http://${config.appHost}:3000`));
