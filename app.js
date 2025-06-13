import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser'; 
import path from 'path';
import { fileURLToPath } from 'url';

import connectToDatabase from './database/connection.js';
import authRouter from './routers/authRouter.js';
import todosRouter from './routers/todosRouter.js';
import pagesRouter from './routers/pagesRouter.js';
import { protectRoute } from './middleware/protectRouter.js';
import { attachUserToken } from './middleware/attachUserToken.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// DB-forbindelse
await connectToDatabase();

// Middleware
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());
app.use(cookieParser());
app.use(attachUserToken); // Tilføjer req.user hvis token findes
app.use(express.static(path.join(__dirname, 'public'))); // Serverer frontend-filer

// Public API-ruter
app.use('/api/auth', authRouter);

// Beskyttet API (kræver JWT-token)
app.use('/api/todos', protectRoute, todosRouter);

// Alle sider — beskyttelse håndteres *internt* i pagesRouter
app.use('/', pagesRouter);

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
