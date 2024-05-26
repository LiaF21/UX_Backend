const {Sequelize} = require('sequelize');

const sequelize = new Sequelize({
    user: "casadavid",
    password: "0okkyQ1jj47lAqwcVUVqssJhlcp6Jhi7",
    host: "dpg-cosjkr20si5c73avdk40-a.ohio-postgres.render.com",
    port: 5432,
    database: "casadavid",
    ssl: true
});
 module.exports=sequelize;