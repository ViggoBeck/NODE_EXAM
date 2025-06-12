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
    ? `<button id="logout-btn" type="button" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
        Log ud
      </button>`
    : ''
  );
  


  return header + pageContent + footer;
}
