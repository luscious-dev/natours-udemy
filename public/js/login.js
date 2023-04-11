const form = document.querySelector('.form');

function login(email, password) {
  return axios
    .post('http://localhost:3000/api/v1/users/login', {
      email,
      password
    })
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      console.log(err);
    });
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  const email = document.querySelector('.form__input[type=email]');
  const password = document.querySelector('.form__input[type=password]');

  await login(email.value, password.value);
});
