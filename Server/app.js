import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import authRouter from './routers/api/authRouter.js';
import todosRouter from './routers/api/todosRouter.js';
import pagesRouter from './routers/pagesRouter.js';
import { protectRoute } from './middleware/authMiddleware.js';

const app = express();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error", err));

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

// Public auth routes
app.use('/api/auth', authRouter);

// Beskyt alle sider og API'er
app.use('/', protectRoute, pagesRouter);
app.use('/api/todos', protectRoute, todosRouter);

// Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
