import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://react-burger-builder-5c382.firebaseio.com/'
});

export default instance;