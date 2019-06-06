# [WIP] cubejs-test
A test harness for @cubejs-backend/server

**cubejs-test** is a test harness leveraging docker to help you test your schemas and setup.
It is configured to help you develop using TDD/BDD on your development setup and then deploy
your configuration to production.


## Contents

- [Getting Started](#getting-started)
- [How to Use: Testing](#how-to-use-testing)
- [How to Use: Deployment](#how-to-use-deployment)
- [Limitations](#limitations)
- [License](./LICENSE)

## Getting Started

### 0. Prerequisites

In order to run this suite, you need to have `git`, `docker`, `docker-compose` and `npm/node` installed.
Original tests run using async/await without prior transpilation, hence it is preferable to use
`node >=10` in order to run the tests, or to rewrite the tests as necessary.

### 1. Clone this repository

```sh
  $ git clone https://github.com/arthurintelligence/cubejs-test
  $ cd cubejs-test
```

### 2. Create and fill your .env file

```sh
  $ touch .env
```

Paste the following in your .env file, and change the secret:

```
# DB
CUBEJS_DB_USER=root
CUBEJS_DB_PASS=example
CUBEJS_DB_NAME=db_cubejs_test

# CubeJS
CUBEJS_APP=cubejs-test
CUBEJS_API_SECRET=<secret>
```

### 2. Install the dependencies & start the containers

```sh
  $ npm install
  $ docker-compose -f docker-compose.development.yml up
```

### 3. Run your test suites

```sh
  $ npm run e2e
  $ npm run test
```

## How to Use: Testing

### Unit Testing

You can test the [configuration logic](https://cube.dev/docs/@cubejs-backend-server-core#options-reference) provided to the CubejsServer 
constructor using the unit testing suite.

Unit tests are located under the `__tests__` directory and must have the `.test.js` extension.

To run the testing suite, use `npm run test`.\
For watch options, use `npm run watch`.

### Integration Testing

You can test your schemas in action using the e2e testing suite. 

Integration tests are located under the `__e2e__` directory and must have the `.test.js` extension.\

#### Fixtures

#### `__e2e__/__fixtures__/cube`

`cube([options: Object]): CubejsApi` \
Creates an instance of CubejsApi client and its jwt.

* `options: Object`: Payload to embed in the JWT token sent over to the backend. 

#### `__e2e__/__fixtures__/database`

`db.query(sql: string): Promise<undefined>`\
Execute SQL against the cube_mysql container

* `sql: string`: SQL string to execute against the mysql database

## How to Use: Deployment

### 1. Create and fill your .env file

```sh
  $ touch .env
```

Paste the following in your .env file, and change the values:

```
# DB
CUBEJS_DB_HOST=cube_mysql
CUBEJS_DB_PORT=3306
CUBEJS_DB_TYPE=mysql
CUBEJS_DB_USER=root
CUBEJS_DB_PASS=example
CUBEJS_DB_NAME=db_cubejs_test
REDIS_URL=redis://cube_redis

# CubeJS
CUBEJS_APP=cubejs-test
CUBEJS_API_SECRET=<secret>
```

### 2. Install the dependencies & start the containers

If you want to deploy redis on the same server using docker-compose, do the following:

```sh
  $ npm install
  $ docker-compose -f docker-compose.production.yml up
```

If you only want to deploy cubejs, do the following instead:

```sh
  $ npm install
  $ docker build --tag=cubejs . && docker run --env-file=.env -p 4000:4000 cubejs 
```

## Limitations

* only supports **mysql** as your database.
* end-to-end tests only support single-tenancy. Multitenancy logic can be tested through unit tests, or partially by providing the e2e `cube` fixture with a payload to incorporate in the JWT token.
* this was developed on MacOS, and hasn't been operated on a Windows OS yet.
* does not support schemas that both use the same table as you need to create & delete your tables
  for each e2e test suite.



