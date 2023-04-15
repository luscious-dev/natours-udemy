import '@babel/polyfill';
import { login, logout } from './login';
import { displayMap } from './leaflet';

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const form = document.querySelector('.form');
const logoutBtn = document.querySelector('.nav__el--logout');

// DELEGATION
if (mapBox) {
  const locations = JSON.parse(
    document.getElementById('map').dataset.locations
  );
  displayMap(locations);
}

if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const email = document.querySelector('.form__input[type=email]');
    const password = document.querySelector('.form__input[type=password]');

    await login(email.value, password.value);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}
