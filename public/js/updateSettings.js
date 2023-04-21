import axios from 'axios';
import { showAlert } from './alert';

export async function updateSettings(data, type) {
  // axios
  //   .patch('http://localhost:3000/api/v1/users/updateMe', {
  //     name: name.value,
  //     email: email.value
  //   })
  //   .then(res => {
  //     console.log(res.data);
  //     const newUser = res.data.data.user;
  //     name.value = newUser.name;
  //     email.value = newUser.email;

  //     showAlert('success', 'Details updated successfully');
  //   })
  //   .catch(err => {
  //     showAlert('error', err.response.data.message);
  //   });

  try {
    const url =
      type === 'password'
        ? 'http://localhost:3000/api/v1/users/updateMyPassword'
        : 'http://localhost:3000/api/v1/users/updateMe';
    const res = await axios({
      method: 'PATCH',
      url,
      data
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
}
