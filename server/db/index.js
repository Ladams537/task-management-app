import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;

// Create a new pool instance to connect to the PostgreSQL database.
// This single pool will be shared across the application.
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Use the 'connect' event to set the schema for every new client connection.
// This is a more robust method to ensure all queries find tables in the 'public' schema.
pool.on('connect', (client) => {
    client.query('SET search_path = public');
});


// We export a query function that will be used to interact with the database.
// This helps abstract the database logic.
export const query = (text, params) => pool.query(text, params);

