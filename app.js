import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import path from 'path';
import { fileURLToPath } from 'url';

import connectToDatabase from './database/connection.js';
import authRouter from './routers/api/authRouter.js';
import todosRouter from './routers/api/todosRouter.js';
import pagesRouter from './routers/pagesRouter.js';
import { protectRoute } from './middleware/protectRouter.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// DB-forbindelse
await connectToDatabase();

// Sessions
app.use(session({
  secret: process.env.SESSION_SECRET || "hemmelig",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions'
  }),
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: "lax"
  }
}));

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Public API
app.use('/api/auth', authRouter);

app.get('/login', (req, res) => res.send(pagesRouter.handleLogin()));
app.get('/signup', (req, res) => res.send(pagesRouter.handleSignup()));

// Beskyttede API og sider
app.use('/api/todos', protectRoute, todosRouter);
app.use('/', protectRoute, pagesRouter);

// Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});