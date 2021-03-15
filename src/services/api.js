import axios from 'axios';
axios.defaults.baseURL = 'https://g8u6rk1r2e.execute-api.us-east-1.amazonaws.com/dev/users';

export default {

  getToken() {
    let tokenVal = localStorage.getItem('_token')
    if (tokenVal) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${tokenVal}`
    }
  },

  common(url) {
    //update token each request
    this.getToken();
    return {
      get: () => axios.get(url),
      post: (toUpdate) => axios.post(url, toUpdate),
      put: (toUpdate) => axios.put(url, toUpdate),
      delete: ({ id }) => axios.delete(`${url}/${id}`)
    }
  }
}