import { Auth0Client } from '@auth0/auth0-spa-js';
import axios from 'axios';
import router from '../router';
import store from '../store';

const roleString = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

class Auth0Service {
  constructor(store, router, options) {
    this.store = store;
    this.router = router;
    this.options = options;
  }

  async createClient() {
    this.store.dispatch('user/setIsLoading', true);

    try {
      this.auth0Client = await new Auth0Client(this.options);

      const searchQuery = window.location.search;

      if (searchQuery.includes('code=') && searchQuery.includes('state=')) {
        const { appState } = await this.auth0Client.handleRedirectCallback();
        const redirectRoute = appState?.targetUrl ? appState.targetUrl : window.location.pathname;

        this.router.push(redirectRoute).catch((error) => {
          console.warn(error);
        });
      }
    } catch (error) {
      this.store.dispatch('user/setAuthError', true);
    } finally {
      const [isAuthenticated, user] = await Promise.all([
        this.auth0Client.isAuthenticated(),
        this.auth0Client.getUser(),
      ]);

      if (isAuthenticated) {
        this.store.dispatch('user/setAuth0Data', {
          isAuthenticated,
          user: this.parseUser(user),
        });

        await this.setToken();
      }

      this.store.dispatch('user/setIsLoading', false);
    }
  }

  login() {
    return this.auth0Client.loginWithRedirect(this.options);
  }

  logout() {
    return this.auth0Client.logout(this.options);
  }

  async setToken() {
    const token = await this.auth0Client.getTokenSilently(this.options);

    axios.defaults.headers['authorization'] = `Bearer ${token}`;
  }

  parseUser(user) {
    user.roles = user[roleString][0];

    delete user[roleString];

    return user;
  }
}

const auth0Service = new Auth0Service(store, router, {
  audience: process.env.VUE_APP_AUTH0_AUDIENCE,
  client_id: process.env.VUE_APP_AUTH0_CLIENT_ID,
  domain: process.env.VUE_APP_AUTH0_DOMAIN,
  redirect_uri: window.location.origin,
  returnTo: window.location.origin,
  cacheLocation: 'localstorage',
});

export const Auth0Plugin = {
  install(Vue) {
    Vue.prototype.$auth = auth0Service;
  },
};

export default auth0Service;
