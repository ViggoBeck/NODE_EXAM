import { Router } from "express";
import { frontpagePage, getCalendarPage, getTodoPage } from "../util/pages.js";
import { readPage } from "../util/templatingEngine.js";

const router = Router();

// Forside
router.get("/", (req, res) => {
  res.send(frontpagePage);
});

// To-do side
router.get("/todos", (req, res) => {
  const todoHtml = readPage("./public/pages/todo/todo.html");
  const todosPage = getTodoPage(todoHtml, {
    title: "Min To-do liste"
  });
  res.send(todosPage);
});

router.get("/calendars", (req, res)=>{
  const calendarHtml = readPage("./public/pages/calendar/calendar.html");
  const calendarsPage = getCalendarPage(calendarHtml, {
    title: "Min Kalender"
  });
  res.send(calendarsPage);
});

export default router;
