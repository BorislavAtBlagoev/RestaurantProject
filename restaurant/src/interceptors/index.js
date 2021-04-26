import axios from 'axios';
import Vue from 'vue';

export const responseInterceptor = () => {
  axios.interceptors.response.use(
    (res) => res,
    (err) => {
      const { msg } = err;
      console.warn(msg);

      Vue.$toast.open({
        message: 'Oops something went wrong!',
        type: 'error',
        position: 'top-right',
        duration: 4000,
        pauseOnHover: true,
        dismissible: true,
      });
    },
  );
};
