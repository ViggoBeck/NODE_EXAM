import { readPage, constructPage} from './templatingEngine.js';


function getCommonCssLinks() {
    return `
      <link rel="stylesheet" href="/assets/css/footer.css">
      <link rel="stylesheet" href="/assets/css/main.css">
      <link rel="stylesheet" href="/assets/css/header.css">
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" rel="stylesheet">
    `;
};

// Forside
const frontpage = readPage('./public/pages/frontpage/frontpage.html');
export const frontpagePage = constructPage(frontpage, {
    title: 'Forside | To-do App',
    cssLinks: getCommonCssLinks()
});

// To-do side
export function getTodoPage(todoContentHtml, dynamicOptions = {}) {
  return constructPage(todoContentHtml, {
    title: dynamicOptions.title || "To-do Liste",
    cssLinks: getCommonCssLinks(),
    cssLinks: `<link rel="stylesheet" href="../assets/css/todo.css">`
  });
};
// Kalender side
export function getCalendarPage(calendarContentHtml, dynamicOptions = {}) {
  return constructPage(calendarContentHtml, {
    title: dynamicOptions.title || "Kalender",
    cssLinks: getCommonCssLinks(),
    cssLinks: `<link rel="stylesheet" href="../assets/css/calendar.css">`
  });
};