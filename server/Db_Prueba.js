const Pool = require("pg").Pool
const pool = new Pool({
    user: "casadavid",
    password: "0okkyQ1jj47lAqwcVUVqssJhlcp6Jhi7",
    host: "dpg-cosjkr20si5c73avdk40-a.ohio-postgres.render.com",
    port: 5432,
    database: "casadavid",
    ssl: true
});
 module.exports=pool;