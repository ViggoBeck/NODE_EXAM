import { login, signup, logout } from './authApi.js';

document.addEventListener('DOMContentLoaded', () => {
  // Login
  const loginForm = document.querySelector('#login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.querySelector('#username').value;
      const password = document.querySelector('#password').value;

      const res = await login(username, password);

      if (res.message === 'Logget ind') {
        window.location.href = '/todos';
      } else {
        document.querySelector('#message').textContent = res.message || 'Login fejlede';
      }
    });
  }

  // Signup
  const signupForm = document.querySelector('#signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.querySelector('#username').value;
      const email = document.querySelector('#email').value;
      const password = document.querySelector('#password').value;

      const res = await signup(username, password, email);

      if (res.message === 'Bruger oprettet') {
        window.location.href = '/todos';
      } else {
        document.querySelector('#message').textContent = res.message || 'Signup fejlede';
      }
    });
  }

  // Logout
  const logoutBtn = document.querySelector('#logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      try {
        const res = await logout();
        console.log(res.message);
        window.location.href = '/login'; 
      } catch (err) {
        console.error('Fejl ved logout:', err);
      }
    });
  }
});
