import pkg from 'pg';
import dotenv from 'dotenv';
import { exit } from 'process';

const { Pool } = pkg;

dotenv.config();

export const db = new Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: 'db_bike_rental',
    port: parseInt(process.env.POSTGRES_PORT || '5433', 10),
    database: process.env.POSTGRES_DB,
});

export async function connectToDatabase() {
    console.log("[INFO] Trying to connect on db on port : ", process.env.POSTGRES_PORT)
    try {
        await db.connect();
        console.log('[INFO] Postgres connected on port', process.env.POSTGRES_PORT);
    } catch (error) {
        console.log('[ERROR] Error connecting to Postgres', error);
        exit(1);
    }
}