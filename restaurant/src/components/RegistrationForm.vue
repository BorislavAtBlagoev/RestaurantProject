<template>
  <div class="container">
    <label id="errorMessageLabel" class="label is-large" v-if="shouldShowErrorMessage">{{ errorMessage }}</label>
    <div class="columns level-item has-text-centered is-rounded">
      <div class="registration-form">
        <div class="column">
          <div class="field">
            <label class="label is-medium">First name</label>
            <div class="control">
              <input
                class="input is-info is-rounded is-medium"
                type="text"
                placeholder="e.g John"
                v-model="firstName"
              />
            </div>
          </div>

          <div class="field">
            <label class="label is-medium">Last name</label>
            <div class="control">
              <input class="input is-info is-rounded is-medium" type="text" placeholder="e.g Doe" v-model="lastName" />
            </div>
          </div>

          <div class="field">
            <label class="label is-medium">Email</label>
            <div class="control">
              <input
                class="input is-info is-rounded is-medium"
                type="email"
                placeholder="e.g. JohnDoe@gmail.com"
                v-model="email"
              />
            </div>
          </div>

          <div class="field">
            <label class="label is-medium">Role</label>
            <div class="control">
              <input class="input is-info is-rounded is-medium" type="email" placeholder="e.g. Waiter" v-model="role" />
            </div>
          </div>

          <div class="field">
            <label class="label is-medium">Password</label>
            <input
              class="input is-info is-rounded is-medium"
              type="password"
              placeholder="Password"
              v-model="password"
            />
          </div>

          <div class="field">
            <label class="label is-medium">Confirm password</label>
            <input
              class="input is-info is-rounded is-medium"
              type="password"
              placeholder="Confirm password"
              v-model="confirmPassword"
            />
          </div>

          <button class="button is-info is-medium is-fullwidth" @click="signUp()" :disabled="shouldDisableButton()">
            Sign up
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      firstName: '',
      lastName: '',
      email: '',
      role: '',
      password: '',
      confirmPassword: '',
      errorMessage: 'Invalid input data! Please, try again!',
      shouldShowErrorMessage: false,
    };
  },
  computed: {
    fullName() {
      return this.firstName + ' ' + this.lastName;
    },
  },
  methods: {
    signUp() {
      if (this.nameValidations() && this.emailValidations() && this.passwordValidations()) {
        const createUserData = {
          email: this.email,
          password: this.password,
          name: this.fullName,
          role: this.role,
        };

        this.$store.dispatch('user/createUser', createUserData);
      }
    },
    shouldDisableButton() {
      if (this.nameValidations() && this.emailValidations() && this.passwordValidations()) {
        return false;
      }

      return true;
    },
    nameValidations() {
      return this.firstName.length > 1 && this.lastName.length > 1;
    },
    emailValidations() {
      return this.email.length > 4 && this.email.includes('@');
    },
    passwordValidations() {
      return this.password === this.confirmPassword && this.password.length > 5;
    },
  },
};
</script>

<style>
#errorMessageLabel {
  color: #ff0000;
}
</style>
