import axios from 'axios';

const profile = {
  namespaced: true,
  actions: {
    uploadPicture(_, payload) {
      axios.post(`${process.env.VUE_APP_API_URL}/images/`, payload);
    },
  },
};

export default profile;
