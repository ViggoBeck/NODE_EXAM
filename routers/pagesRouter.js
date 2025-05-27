import { Router } from "express";
import {
  frontpagePage,
  getCalendarPage,
  getTodoPage,
  getLoginPage,
  getSignupPage
} from "../util/pages.js";

import { readPage } from "../util/templatingEngine.js";

const router = Router();

// Forside
router.get("/", (req, res) => {
  res.send(frontpagePage);
});

// To-do side
router.get("/todos", (req, res) => {
  const todoHtml = readPage("./public/pages/todo/todo.html");
  res.send(getTodoPage(todoHtml, { title: "Min To-do liste" }));
});

// Kalender side
router.get("/calendars", (req, res) => {
  const calendarHtml = readPage("./public/pages/calendar/calendar.html");
  res.send(getCalendarPage(calendarHtml, { title: "Min Kalender" }));
});
// Login side
router.handleLogin = () => getLoginPage();

router.handleSignup = () => getSignupPage();

export default router;
