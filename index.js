const CubejsServer = require('@cubejs-backend/server');
const cubejsOptions = require('./cubejsOptions');

const server = cubejsOptions ? new CubejsServer() : new CubejsServer(cubejsOptions);

server.listen().then(({ port }) => {
  console.log(`🚀 Cube.js server is listening on ${port}`);
});
