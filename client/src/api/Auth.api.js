import axiosInstance from './axiosInstance';
import Cookies from 'js-cookie';

const signInRequest = async (username, password) => {
  try {
    const response = await axiosInstance.post('auth/login', {
      username,
      password,
    });

    if (response.data.token) {
      Cookies.set('token', response.data.token);
    }

    return response;
  } catch (error) {
    return null;
  }
};

export default { signInRequest };
