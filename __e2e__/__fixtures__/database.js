const path = require("path");
const uuidv4 = require("uuid/v4");
const uuidv5 = require("uuid/v5");
const { exec } = require("child_process");

// FIXME: This is a workaround to be able to execute SQL on the container
// A better way would be to use an npm module, but I was unable to connect to the container from
// the host's standpoint.
// Attempted alternatives:
// * Connect to the container via its network IP & port =>
//   CUBEJS_DB_HOST=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' cube_mysql) jest --watch
//   => times out
// * Expose the port and connect via localhost in the docker-compose file =>
//   ERROR: for cube_mysql  Cannot start service cube_mysql: driver failed programming external
//   connectivity on endpoint cube_mysql(0cf659533c0d1f0733025d1a3247b46e57bb53b326d537a054a73b90a0d3deb3):
//   Error starting userland proxy: Bind for 0.0.0.0: 3306 failed: port is already allocated
// (after the fact)
// Just had another idea => create a container solely to run the tests. That way, we can access the
// db no problem from the test container. The only issue is going to be the developer experience
// as I'm not sure jest will show up properly through the logs of docker-compose/docker
/**
 * Execute SQL against the cube_mysql container
 * @param {string} sql SQL string to execute against the mysql database
 * @returns Return a promise of resolution of the query. Promise resolves to undefined if successful.
 */
function query(sql) {
  const command = `docker exec cube_mysql /usr/bin/mysql \
    --user=${process.env.CUBEJS_DB_USER} \
    --password=${process.env.CUBEJS_DB_PASS} \
    --execute \"${sql.replace(/\n\s+/g, " ")}\"\
  `;
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

async function createDatabase({ namespace, databaseName } = {}) {
  try {
    namespace = namespace || uuidv4();
    databaseName = 
      databaseName ||
      uuidv5(
        path.basename(__filename),
        namespace
      ).replace(/-/g, '');
    await query(`
      CREATE DATABASE IF NOT EXISTS ${databaseName};
      USE ${databaseName};
    `);
    return { databaseName, namespace };
  } catch (err) {
    throw new Error(`Failed to create database: ${err.message}`);
  }
}

async function deleteDatabase(databaseName) {
  try {
    const result = await query(`DROP DATABASE ${databaseName};`);
    return result;
  } catch (err) {
    throw new Error(`Failed to delete database: ${err.message}`);
  }
}

module.exports = {
  query,
  createDatabase,
  deleteDatabase,
};
