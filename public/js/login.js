import axios from 'axios';
import { showAlert } from './alert';

export const login = function(email, password) {
  return axios
    .post('http://localhost:3000/api/v1/users/login', {
      email,
      password
    })
    .then(res => {
      console.log(res);
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    })
    .catch(err => {
      showAlert('error', err.response.data.message);
    });
};
