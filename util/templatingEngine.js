import fs from 'fs';

export function readPage(path) {
  return fs.readFileSync(path, 'utf-8');
}

const headerTemplate = readPage('./public/components/header.html');
const footerTemplate = readPage('./public/components/footer.html');

export function constructPage(pageContent, options = {}) {
  let header = headerTemplate;
  let footer = footerTemplate;

  // Standard placeholders
  header = header
    .replace('$NAV_TITLE$', options.title || 'To-do')
    .replace('$CSS_LINKS$', options.cssLinks || '');

  // Tilføj dynamiske brugerdata (JWT)
  const username = options.username || '';
  const isLoggedIn = Boolean(username);

  header = header.replace('$USERNAME$', username);
  header = header.replace('$LOGOUT_BUTTON$', isLoggedIn 
    ? `<form method="POST" action="/api/auth/logout"><button>Log ud</button></form>` 
    : ''
  );

  return header + pageContent + footer;
}
