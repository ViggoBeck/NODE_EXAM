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

// Forside
export function getFrontpagePage(req) {
  let frontpage = readPage('./public/pages/frontpage/frontpage.html');
  const username = req.user?.username || '';

  frontpage = frontpage.replace('$USERNAME$', username);

  return constructPage(frontpage, {
    title: 'Forside | To-do App',
    cssLinks: getCommonCssLinks(),
    username,
    userId: req.user?._id.toString() || ''
  });
}

// To-do side
export function getTodoPage(req) {
  const todoContent = readPage('./public/pages/todo/todo.html');
  return constructPage(todoContent, {
    title: 'Min To-do liste',
    cssLinks: getCommonCssLinks() + `<link rel="stylesheet" href="/assets/css/todo.css">`,
    username: req.user?.username || '',
    userId: req.user?._id.toString() || ''
  });
}

// Kalender side
export function getCalendarPage(req) {
  const calendarContent = readPage('./public/pages/calendar/calendar.html');
  return constructPage(calendarContent, {
    title: 'Min Kalender',
    cssLinks: getCommonCssLinks() + `<link rel="stylesheet" href="/assets/css/calendar.css">`,
    username: req.user?.username || '',
    userId: req.user?._id.toString() || ''
  });
}

export function getFriendsPage(req) {
  const friendsHtml = readPage('./public/pages/friends/friends.html');
  return constructPage(friendsHtml, {
    title: 'Mine Venner',
    cssLinks: getCommonCssLinks() + `<link rel="stylesheet" href="/assets/css/friends.css">`,
    username: req.user?.username || '',
    userId: req.user?._id.toString() || ''
  });
}

// Login side
export function getLoginPage() {
  const loginHtml = readPage('./public/pages/auth/login.html');
  return constructPage(loginHtml, {
    title: 'Login | To-do App',
    cssLinks: getCommonCssLinks() + `<link rel="stylesheet" href="/assets/css/login.css">`
  });
}

// Signup side
export function getSignupPage() {
  const signupHtml = readPage('./public/pages/auth/signup.html');
  return constructPage(signupHtml, {
    title: 'Opret Bruger | To-do App',
    cssLinks: getCommonCssLinks() + `<link rel="stylesheet" href="/assets/css/login.css">`
  });
}
