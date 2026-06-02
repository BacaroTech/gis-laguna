import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import axios from 'axios';
import { Client } from 'pg';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const urlProxy =
  'https://dati.venezia.it/sites/default/files/dataset/opendata';

const requiredEnvVars = [
  'DATABASE_PORT',
  'DATABASE_USR',
  'DATABASE_PASSWORD',
  'DATABASE_NAME',
  'DATABASE_HOST',
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

const pool = new Client({
  user: process.env.DATABASE_USR,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  database: process.env.DATABASE_NAME,
});

app.use(cors());
app.use(express.json());

/**
 * Helper per creare endpoint velocemente
 */
const createProxyRoute = (route: string, fileName: string) => {
  app.get(route, async (req, res) => {
    try {
      const response = await axios.get(`${urlProxy}/${fileName}`);

      res.json({
        status: 'success',
        data: response.data,
      });
    } catch (error: any) {
      res.status(500).json({
        status: 'error',
        error: error.message,
      });
    }
  });
};

/**
 * PROXY ROUTES BY https://dati.venezia.it/?q=content/cpsm-dati-meteomarini-laguna-e-litorale-veneziano
 */

createProxyRoute('/levels', 'livello.json');
createProxyRoute('/wind', 'vento.json');
createProxyRoute('/wathertemp', 'tempacqua.json');
createProxyRoute('/radiation', 'radiazione.json');
createProxyRoute('/pressure', 'pressione.json');
createProxyRoute('/moon', 'fluna2026.json');
createProxyRoute('/water-temperature', 'tempacqua.json');
createProxyRoute('/humidity', 'umidita.json');
createProxyRoute('/air-temperature', 'temparia.json');
createProxyRoute('/lagoon-waves', 'onde_laguna.json');
createProxyRoute('/forecast', 'previsione.json');
createProxyRoute('/high-tide-min', 'as2026min.json');
createProxyRoute('/cnr-high-tide-min', 'ascnr2026min.json');

/**
 * START SERVER
 */
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

/**
 * DB CONNECTION
 */

pool
  .connect()
  .then(() => console.log('Database connection established'))
  .catch((err: Error) =>
    console.error('DB connection failed:', err)
  );