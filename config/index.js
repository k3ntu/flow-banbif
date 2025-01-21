const dotenv = require('dotenv')

const env = process.env.NODE_ENV || 'local';
const dotenvFile = `${__dirname}/../.env`;
dotenv.config({ path: dotenvFile })

const config = {
  appHost: '0.0.0.0',
  sfmc: {
    host: process.env.SFMC_URL,
    grant_type: process.env.GRANT_TYPE,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET
  }
}

module.exports = config;