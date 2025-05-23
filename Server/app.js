import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json());

// public-mappen kan ses, til images, css osv 
app.use(express.static(path.join(__dirname, 'public')));

// ROUTERS
import todosRouter from './routers/api/todosRouter.js';
import pagesRouter from './routers/pagesRouter.js';

app.use("/api/todos", todosRouter); // API-ruter
app.use("/", pagesRouter);          // SSR-sider

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("Server is running on PORT:", PORT));
