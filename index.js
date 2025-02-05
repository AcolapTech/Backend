import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import db from './config/db.js';
import user from './app/routes/user.js';
import role from "./app/routes/rol.js";
import emp from "./app/routes/emp.js";
import agn from "./app/routes/Agenda.js";
import news from "./app/routes/News.js";
import pqr from "./app/routes/PQR.js";

dotenv.config();

const app = express();

app.use(cookieParser());

const corsOptions = {
  origin: ['https://acolap.org.co', 'http://localhost:3000'],  // Asegúrate de incluir tu dominio aquí
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin'],
  credentials: true,  // Permite que las cookies sean enviadas
};

app.use('/uploads', express.static('uploads'));
app.use('/uploads_news', express.static('uploads_news'));
app.use('/uploads_pdfs', express.static('uploads_pdfs')); 
app.use(cors(corsOptions));

// Configurar el parser de cookies

// Aplicar middleware para procesar JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define tus rutas
app.use("/api/role", role);
app.use("/api/user", user);
app.use("/api/emp", emp);
app.use("/api/agn", agn);
app.use("/api/news", news);
app.use("/api/pqr", pqr);

app.listen(process.env.PORT, '0.0.0.0', () =>
  console.log('Backend server running on port: ' + process.env.PORT)
);

db.dbConnection();
