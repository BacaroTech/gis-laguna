import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import axios from 'axios';
import { Client } from 'pg';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const urlProxy: string = "https://dati.venezia.it/sites/default/files/dataset/opendata";

const requiredEnvVars = ['DATABASE_PORT', 'DATABASE_USR', 'DATABASE_PASSWORD', 'DATABASE_NAME', 'DATABASE_HOST'];
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

app.get('/levels', async (req, res) => {
  const url = urlProxy + "/livello.json";
  try {
    const response = await axios.get(url);
    res.json({ status: 'success', data: response.data });
  } catch (error: any) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

app.get('/wind', async (req, res) => {
  const url = urlProxy + "/vento.json";
  try {
    const response = await axios.get(url);
    res.json({ status: 'success', data: response.data });
  } catch (error: any) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

app.get('/wathertemp', async (req, res) => {
  const url = urlProxy + "/tempacqua.json";
  try {
    const response = await axios.get(url);
    res.json({ status: 'success', data: response.data });
  } catch (error: any) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

app.get('/radiation', async (req, res) => {
  const url = urlProxy + "/radiazione.json";
  try {
    const response = await axios.get(url);
    res.json({ status: 'success', data: response.data });
  } catch (error: any) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

app.get('/pressure', async (req, res) => {
  const url = urlProxy + "/pressione.json";
  try {
    const response = await axios.get(url);
    res.json({ status: 'success', data: response.data });
  } catch (error: any) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

// ✅ Server starts immediately, DB connects separately
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

pool.connect()
  .then(() => console.log('Database connection established'))
  .catch((err: Error) => console.error('DB connection failed:', err));