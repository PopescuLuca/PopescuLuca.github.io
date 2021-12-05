<template>
  <div>
    <div v-if="isLoggedIn">
      <b>{{ cheltuiala.data }} </b>
      <div>{{ cheltuiala.detalii }}</div>
      <b> {{ cheltuiala.tipPlata }}</b>
      <div>{{ cheltuiala.suma }}</div>
      <button @click="edit">Edit</button>
      <button @click="deleteCh">Delete</button>
    </div>
  </div>
</template>

<script>
import utils from "../utils"
export default {
  name: "Cheltuieli",
  props: {
    cheltuiala: Object,
  },
  // data() {

  // },
  computed: {
    isLoggedIn() {
      return this.$store.state.isLoggedIn;
    },
  },
  methods: {
    edit() {
      this.$emit("edit", this.cheltuiala);
    },
    deleteCh() {
      console.log(`vrei sa stergi cheltuialla ${this.cheltuiala.id}`)
      
  let requestParameters = { ...utils.globalRequestParameters };
  let token = window.localStorage.getItem('token');
  requestParameters.headers.Authorization = 'Bearer ' + token;
  requestParameters.method = 'DELETE';
  fetch(utils.url + "cheltuieli/" + this.cheltuiala.id, requestParameters)
    .then(res => res.json()).then(res => {
      console.log(res);
      if (res.message === 'Decoding error!' || res.message === 'Your token expired') {
        console.log('nu ai voie')
      } else {
        this.$store.dispatch("deleteCheltuiala", this.cheltuiala);
      }
    });
      
    },
  },
};
</script>

<style></style>
