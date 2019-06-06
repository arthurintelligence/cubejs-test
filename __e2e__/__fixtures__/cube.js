const cubejs = require('@cubejs-client/core');
const jwt = require('jsonwebtoken');

/**
 * Creates an instance of CubejsApi
 * @param {Object} payload 
 * @returns {CubejsApi} Instance of CubejsApi client.
 */
function cube(payload = {}) {
  return cubejs(
    jwt.sign(payload, process.env.CUBEJS_API_SECRET, { expiresIn: '30d' }),
    { apiUrl: 'http://localhost:4000/cubejs-api/v1' }
  );
}

module.exports = cube;