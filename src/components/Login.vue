<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="login()">
      <input v-model="email" type="email" placeholder="email" />
      <input v-model="password" type="password" placeholder="password" />
      <button type="submit">Login</button>
    </form>
    <div>
      {{ mesaj }}
    </div>
  </div>
</template>

<script>
import utils from "../utils.js";
export default {
  name: "Register",
  data() {
    return {
      email: "",
      mesaj: "",
      password: "",
    };
  },
  methods: {
    login() {
      let data = {
        email: this.email,
        password: this.password,
      };
      let requestParameters = utils.globalRequestParameters;
      requestParameters.method = "POST";
      requestParameters.body = JSON.stringify(data);

      fetch(utils.url + "login", requestParameters).then((res) => {
        res.json().then((res) => {
          this.mesaj = res.message;
          if (res.token) {
            localStorage.setItem("token", res.token);
            this.$store.dispatch("login", true);
          }
        });
      });
    },
  },
};
</script>

<style></style>
