const cube = require('../__fixtures__/cube');
const db = require('../__fixtures__/database');
const handlebars = require("../__fixtures__/handlebars");
const insertTemplate = handlebars("./Orders.insert.hbs.sql");

var cubejsApi;
var databaseName;

beforeAll(async () => {
  const result = await db.createDatabase();
  databaseName = result.databaseName;
  cubejsApi = cube({ databaseName });
  return db.query(insertTemplate({ databaseName }));
});

afterAll(() => databaseName && db.deleteDatabase(databaseName));

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