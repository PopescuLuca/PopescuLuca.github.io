<template>
  <div>
    <form @submit="onSubmit">
      <input
        v-model="formPlata.nume"
        placeholder="contul din care a fost facuta plata"
      />
      <button type="submit">{{ action }}</button>
    </form>
  </div>
</template>

<script>
import utils from "../utils";
export default {
  name: "AddEditFormPlata",
  data() {
    return {
      formPlata: {},
    };
  },
  props: {
    action: {
      type: String,
      default: "Add",
    },
    tipPlata: Object,
  },
  updated() {
    this.formPlata = this.tipPlata;
  },
  methods: {
    edit() {
      console.log(
        `Vrei sa te editezi plata cu id-ul: ${this.tipPlata.id}`
      );
      let requestParameters = { ...utils.globalRequestParameters };
      let token = window.localStorage.getItem("token");
      requestParameters.headers.Authorization = "Bearer " + token;
      requestParameters.method = "PUT";

      let data = {};

      data.nume=this.tipPlata.nume;
      requestParameters.body = JSON.stringify(data);

      fetch(utils.url + "tipPlata/" + this.tipPlata.id, requestParameters)
        .then((res) => res.json())
        .then((res) => {
          console.log(res.message);
          if (
            res.message === "Decoding error!" ||
            res.message === "Your token expired!"
          ) {
            console.log("nu ai voie!");
          } else {
            data.id = res.id;
            //this.$store.dispatch("addCheltuiala", data);
          }
        });
    },
    addPlata() {
      console.log(
        `se adauga o plata  ${this.tipPlata.nume}`
      );
      let requestParameters = { ...utils.globalRequestParameters };
      let token = window.localStorage.getItem("token");
      requestParameters.headers.Authorization = "Bearer " + token;
      requestParameters.method = "POST";

      let data = {};
      data.nume=this.tipPlata.nume;

      requestParameters.body = JSON.stringify(data);

      console.log("Vreau sa adaug tip Plata: ", data);

      fetch(utils.url + "tipPlata", requestParameters)
        .then((res) => res.json())
        .then((res) => {
          if (
            res.message === "Decoding error!" ||
            res.message === "Your token expired!"
          ) {
            console.log("nu ai voie!");
          } else {
            data.id = res.id;
            this.$store.dispatch("addTipPlata", data);
          }
        });
    },
    onSubmit(e) {
      console.log(this.action);
      if (this.action == "Add") {
        this.addPlata();
        e.preventDefault();
      } else {
        this.edit();
        e.preventDefault();
      }
    },
  },
};
</script>

<style></style>
