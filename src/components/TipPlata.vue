<template>
  <div>
    <div v-if="isLoggedIn">
      <div>{{ tipPlata.nume }}</div>
      <button @click="edit">Edit</button>
      <button @click="deleteCh">Delete</button>
    </div>
  </div>
</template>

<script>
import utils from "../utils";
export default {
  name: "TipPlata",
  props: {
    tipPlata: Object,
  },
  computed: {
    isLoggedIn() {
      return this.$store.state.isLoggedIn;
    },
  },
  methods: {
    edit() {
      this.$emit("edit", this.tipPlata);
    },
    deleteCh() {
      console.log(`vrei sa stergi tip Plata ${this.tipPlata.id}`);

      let requestParameters = { ...utils.globalRequestParameters };
      let token = window.localStorage.getItem("token");
      let data = {};

      data.nume = this.tipPlata.nume
      data.id=this.tipPlata.id;
      requestParameters.headers.Authorization = "Bearer " + token;
      requestParameters.method = "DELETE";
      requestParameters.body = JSON.stringify(data);
      fetch(utils.url + "tipPlata/" + this.tipPlata.id, requestParameters)
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
          if (
            res.message === "Decoding error!" ||
            res.message === "Your token expired"
          ) {
            console.log("nu ai voie");
          } else {
            this.$store.dispatch("deleteTipPlata", this.tipPlata);
          }
        });
    },
  },
};
</script>

<style></style>
