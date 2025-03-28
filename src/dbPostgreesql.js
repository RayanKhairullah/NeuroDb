const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.PGHOST || 'localhost',
    user: process.env.PGUSER || 'postgres',     
    password: process.env.PGPASSWORD || 'ryn4k$cript',     
    database: process.env.PGDATABASE || 'neurodbbe',
    port: process.env.PGPORT || 5432,           
});

module.exports = pool;