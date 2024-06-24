const Pool = require('pg').Pool;
const pool = new Pool({
  user: 'postgress',
  password: '200521912',
  host: 'localhost',
  port: 5432,
  database: 'Casa_David',
});
module.exports = pool;
