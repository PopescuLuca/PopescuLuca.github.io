<template>
  <div>
    <!-- // <img alt="Vue logo" src="./assets/logo.png" /> -->
    <div v-if="!isLoggedIn">
      <Login />
      <Register />
    </div>
    <button v-if="isLoggedIn" @click="logout()">Logout</button>
    <tip-plati />
    <cheltuieli-list />
  </div>
</template>

<script>
import Login from "./components/Login.vue";
import Register from "./components/Register.vue";
import CheltuieliList from "./components/CheltuieliList.vue";
import TipPlati from "./components/TipPlati.vue";

export default {
  name: "App",
  components: {
    Login,
    Register,
    CheltuieliList,
    TipPlati,
  },
  computed: {
    isLoggedIn() {
      return this.$store.state.isLoggedIn;
    },
  },
  methods: {
    logout() {
      this.$store.commit("SET_LOGG", false);
      window.localStorage.removeItem("token");
    },
  },
};
</script>

<style>
* {
  box-sizing: border-box;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

body {
  background-color: aqua;
}

form {
  display: flex;
  flex-direction: column;
}

input {
  height: 25px;
}
button {
  height: 25px;
}

@media screen and (min-width: 576px) {
  body {
    background-color: red;
  }
  form {
    flex-direction: row;
    /* gap:20px; */
    align-items: center;
    justify-content: center;
  }

  input {
    flex: 1;
  }

  button {
    flex: 1;
  }
}
@media screen and (min-width: 992px) {
  body {
    background-color: grey;
    text-shadow: white;
  }
}
</style>
