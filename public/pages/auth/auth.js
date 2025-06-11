import { login, signup, logout } from './authApi.js';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.querySelector('#login-form');
  const signupForm = document.querySelector('#signup-form');

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

  //logout-knap
  const logoutBtn = document.querySelector('#logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await logout();
      window.location.href = '/login';
    });
  }
});

