USE {{databaseName}};

CREATE TABLE IF NOT EXISTS {{databaseName}}.Orders (
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