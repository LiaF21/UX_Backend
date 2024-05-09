const Pool = require("pg").Pool
const pool = new Pool({
    user: "postgres",
    password: "postgres",
    host: "34.229.57.146",
    port: 5432,
    database: "postgres",
   // ssl: true
});
 module.exports=pool;