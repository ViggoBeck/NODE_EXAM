import { Router } from "express";
import { protectRoute } from "../middleware/protectRouter.js";
import {
  getFrontpagePage,
  getCalendarPage,
  getTodoPage,
  getLoginPage,
  getSignupPage,
  getFriendsPage
} from "../util/pages.js";

const router = Router();

/* -------- PUBLIC ROUTES -------- */

// Login
router.get("/login", (req, res) => {
  res.send(getLoginPage(req));
});

// Signup
router.get("/signup", (req, res) => {
  res.send(getSignupPage(req));
});

/* -------- PROTECTED ROUTES -------- */

// Forside (kun hvis logget ind)
router.get("/", protectRoute, (req, res) => {
  res.send(getFrontpagePage(req));
});

// To-do side
router.get("/todos", protectRoute, (req, res) => {
  res.send(getTodoPage(req));
});

// Kalender side
router.get("/calendars", protectRoute, (req, res) => {
  res.send(getCalendarPage(req));
});

// Venner side
router.get("/venner", protectRoute, (req, res) => {
  res.send(getFriendsPage(req));
});

export default router;
