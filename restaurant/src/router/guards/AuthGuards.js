import store from '../../store';

export const isAuthenticated = (to, from, next) => {
  if (store.state.user.isAuthenticated) {
    next();
  } else {
    next({ path: '/login' });
  }
};
