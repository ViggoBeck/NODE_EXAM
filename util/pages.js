import { readPage, constructPage } from './templatingEngine.js';

// Fælles CSS-links
function getCommonCssLinks() {
  return `
    <link rel="stylesheet" href="/assets/css/footer.css">
    <link rel="stylesheet" href="/assets/css/main.css">
    <link rel="stylesheet" href="/assets/css/header.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" rel="stylesheet">
  `;
}

// Forside (med mulighed for brugerdata)
export function getFrontpagePage(req) {
  const frontpage = readPage('./public/pages/frontpage/frontpage.html');
  return constructPage(frontpage, {
    title: 'Forside | To-do App',
    cssLinks: getCommonCssLinks(),
    username: req.user?.username || ''
  });
}

// To-do side
export function getTodoPage(req, todoContentHtml, dynamicOptions = {}) {
  return constructPage(todoContentHtml, {
    title: dynamicOptions.title || "To-do Liste",
    cssLinks: `
      ${getCommonCssLinks()}
      <link rel="stylesheet" href="../assets/css/todo.css">
    `,
    username: req.user?.username || ''
  });
}

// Kalender side
export function getCalendarPage(req, calendarContentHtml, dynamicOptions = {}) {
  return constructPage(calendarContentHtml, {
    title: dynamicOptions.title || "Kalender",
    cssLinks: `
      ${getCommonCssLinks()}
      <link rel="stylesheet" href="../assets/css/calendar.css">
    `,
    username: req.user?.username || ''
  });
}

// Login side (ingen brugerinfo)
export function getLoginPage() {
  const loginHtml = readPage('./public/pages/auth/login.html');
  return constructPage(loginHtml, {
    title: 'Login | To-do App',
    cssLinks: `
      ${getCommonCssLinks()}
      <link rel="stylesheet" href="../assets/css/login.css">
    `
  });
}

// Signup side (ingen brugerinfo)
export function getSignupPage() {
  const signupHtml = readPage('./public/pages/auth/signup.html');
  return constructPage(signupHtml, {
    title: 'Opret Bruger | To-do App',
    cssLinks: `
      ${getCommonCssLinks()}
      <link rel="stylesheet" href="../assets/css/login.css">
    `
  });
}
