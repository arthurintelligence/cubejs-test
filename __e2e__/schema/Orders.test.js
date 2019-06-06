require('dotenv').config();
const cube = require('../__fixtures__/cube');
const db = require('../__fixtures__/database');

var cubejsApi;

beforeAll(() => {
  cubejsApi = cube();
  return db.query(`
    CREATE TABLE IF NOT EXISTS ${process.env.CUBEJS_DB_NAME}.Orders (
      id INT,
      status VARCHAR(10) NOT NULL,
      amount INT NOT NULL
    )
    SELECT * FROM (
      SELECT 1 as id, 100 as amount, 'new' status
        UNION ALL
      SELECT 2 as id, 200 as amount, 'new' status
        UNION ALL
      SELECT 3 as id, 300 as amount, 'processed' status
        UNION ALL
      SELECT 4 as id, 500 as amount, 'processed' status
        UNION ALL
      SELECT 5 as id, 600 as amount, 'shipped' status
    ) AS t;
  `);
});

afterAll(
  () => db.query(`DROP TABLE ${process.env.CUBEJS_DB_NAME}.Orders;`);
});

test('should return the correct totalAmounts', async () => {
  const { loadResponse: { data } } = await cubejsApi.load({
    measures: ['Orders.totalAmount'],
    dimensions: ['Orders.status'],
    order: {'Orders.status': 'desc'},
    renewQuery: true
  });

  const expected = [
    { 'Orders.status': 'shipped', 'Orders.totalAmount': 600 },
    { 'Orders.status': 'processed', 'Orders.totalAmount': 800 },
    { 'Orders.status': 'new', 'Orders.totalAmount': 300 }
  ];
  
  expect(data).toEqual(expected);
});