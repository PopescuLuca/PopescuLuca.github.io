<template>
  <div>
    <h1>Register</h1>
    <form @submit.prevent="register()">
      <input v-model="email" type="email" placeholder="email" />
      <input v-model="password" type="password" placeholder="password" />
      <button type="submit">Register</button>
    </form>
    <div>
      {{ mesaj }}
    </div>
    <!-- <p v-if=condition>
            {{success}}
        </p>
        <p v-else>
            {{fail}}
        </p>

        <p v-show=condition>
            Salut
        </p> -->
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
    register() {
      console.log(`Vrei sa te inregistrezi cu email: ${this.email}`);

      let data = {
        email: this.email,
        password: this.password,
      };
      let requestParameters = utils.globalRequestParameters;
      requestParameters.method = "POST";
      requestParameters.body = JSON.stringify(data);

      fetch(utils.url + "user", requestParameters).then((res) => {
        res.text().then((res) => (this.mesaj = res));
      });
    },
  },
};
</script>

<style></style>
