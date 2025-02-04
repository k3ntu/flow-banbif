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
      client_secret: sfmc.client_secret
    });

    const response = await axios.post(`${sfmc.host_auth}/v2/token`,
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

    const response = await axios.post(`${sfmc.host_rest}/interaction/v1/events`, req.body, {
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

app.get('/verify/user', async (req, res) => {
  try {
    const { dni, requestNumber } = req.query;
    if (!dni && !requestNumber) {
      return res.status(400).json({ message: 'El parámetro dni es requerido.' });
    }

    const filter = `DNI eq '${dni}' and isDocument1Read eq 'Y' and isDocument2Read eq 'Y' and isValid eq 'Y' and requestNumber eq '${requestNumber}'`;
    const encodedFilter = encodeURIComponent(filter);

    const url = `${sfmc.host_rest}/data/v1/customobjectdata/key/9214E16C-A065-48C0-B6F2-9B73C640B098/rowset?$filter=${encodedFilter}`;

    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json({ message: 'Token de autorización requerido.' });
    }

    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authorization
      }
    });

    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { message: 'Error interno' });
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
