import { Router } from "express";
import {
  getFrontpagePage,
  getCalendarPage,
  getTodoPage,
  getLoginPage,
  getSignupPage
} from "../util/pages.js";

import { readPage } from "../util/templatingEngine.js";

const router = Router();

// Forside (dynamisk med req.user)
router.get("/", (req, res) => {
  res.send(getFrontpagePage(req));
});

// To-do side (med brugerdata)
router.get("/todos", (req, res) => {
  const todoHtml = readPage("./public/pages/todo/todo.html");
  res.send(getTodoPage(req, todoHtml, { title: "Min To-do liste" }));
});

// Kalender side (med brugerdata)
router.get("/calendars", (req, res) => {
  const calendarHtml = readPage("./public/pages/calendar/calendar.html");
  res.send(getCalendarPage(req, calendarHtml, { title: "Min Kalender" }));
});

// Login & Signup 
router.handleLogin = () => getLoginPage();
router.handleSignup = () => getSignupPage();

export default router;
