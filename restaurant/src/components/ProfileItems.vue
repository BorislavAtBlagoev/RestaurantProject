<template>
  <div class="container">
    <div class="content is-large">
      <h1>Profile</h1>
    </div>

    <div class="columns">
      <div class="column is-one-fifth">
        <figure class="image is-128x128">
          <img :src="image" />
        </figure>
      </div>

      <div class="has-text-left">
        <div class="column">
          <div class="file is-info has-name is-right">
            <label class="file-label">
              <input class="file-input" type="file" ref="fileInput" />
              <span class="file-cta">
                <span class="file-label"> Select a File </span>
              </span>
              <span class="file-name"> File </span>
            </label>
          </div>
        </div>
      </div>

      <div class="has-text-left">
        <div class="column">
          <button class="button is-info" @click="uploadPicture()">Upload</button>
        </div>
      </div>
    </div>

    <div class="columns has-text-left">
      <div class="column">
        <button class="button is-info is-medium" @click="logout()">Logout</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      image: '',
    };
  },
  methods: {
    logout() {
      this.$auth.logout();
    },
    uploadPicture() {
      this.image = this.$refs.fileInput.files[0];

      const formData = new FormData();

      formData.append('image', this.image);
      formData.append('user', 2);

      this.$store.dispatch('profile/uploadPicture', formData);
    },
  },
};
</script>
