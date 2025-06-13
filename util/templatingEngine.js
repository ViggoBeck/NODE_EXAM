import fs from 'fs';

export function readPage(path) {
  return fs.readFileSync(path, 'utf-8');
}

const headerTemplate = readPage('./public/components/header.html');
const footerTemplate = readPage('./public/components/footer.html');

export function constructPage(pageContent, options = {}) {
  const username = options.username || '';
  const isLoggedIn = Boolean(username);

  const header = headerTemplate
    .replace('$NAV_TITLE$', options.title || 'To-do App')
    .replace('$CSS_LINKS$', options.cssLinks || '')
    .replace('$USERNAME$', isLoggedIn ? username : '')
    .replace(
      '$LOGOUT_BUTTON$',
      isLoggedIn
        ? `<button id="logout-btn" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">Log ud</button>`
        : ''
    );

  return header + pageContent + footerTemplate;
}
