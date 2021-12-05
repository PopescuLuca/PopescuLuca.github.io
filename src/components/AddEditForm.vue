<template>
  <div>
    <form @submit="onSubmit">
      <input
        v-if="this.action == 'Add'"
        v-model="formCheltuieli.data"
        placeholder="data exemplu Wed Oct 26 2016"
      />
      <input v-model="formCheltuieli.detalii" placeholder="detalii" />
      <input v-model="formCheltuieli.suma" placeholder="suma" />
      <button type="submit">{{ action }}</button>
    </form>
  </div>
</template>

<script>
import utils from "../utils";
export default {
  name: "AddEditForm",
  data() {
    return {
      formCheltuieli: {},
    };
  },
  props: {
    action: {
      type: String,
      default: "Add",
    },
    cheltuiala: Object,
  },
  updated() {
    this.formCheltuieli = this.cheltuiala;
  },
  methods: {
    edit() {
      console.log(
        `Vrei sa te editezi cheltuiala cu id-ul: ${this.cheltuiala.id}`
      );
      let requestParameters = { ...utils.globalRequestParameters };
      let token = window.localStorage.getItem("token");
      requestParameters.headers.Authorization = "Bearer " + token;
      requestParameters.method = "PUT";

      let data = {};

      data.data = this.cheltuiala.data;
      let myDate = this.cheltuiala.data.split("-");
      var newDate = new Date(myDate[2], myDate[1] - 1, myDate[0]);
      data.data = newDate;
      data.detalii = this.cheltuiala.detalii;
      data.suma = this.cheltuiala.suma;
      data.id = this.cheltuiala.id;
      requestParameters.body = JSON.stringify(data);

      fetch(utils.url + "cheltuieli/" + this.cheltuiala.id, requestParameters)
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
    addCheltuiala() {
      console.log(
        `se adauga o cheltuiala  ${this.cheltuiala.data} ${this.cheltuiala.detalii} ${this.cheltuiala.suma}`
      );
      let requestParameters = { ...utils.globalRequestParameters };
      let token = window.localStorage.getItem("token");
      requestParameters.headers.Authorization = "Bearer " + token;
      requestParameters.method = "POST";

      let data = {};
      data.data = this.cheltuiala.data;
      data.detalii = this.cheltuiala.detalii;
      data.suma = this.cheltuiala.suma;
      data.tipPlata = "Money Market Account";

      requestParameters.body = JSON.stringify(data);

      console.log("Vreau sa adaug produsul: ", data);

      fetch(utils.url + "cheltuieli", requestParameters)
        .then((res) => res.json())
        .then((res) => {
          if (
            res.message === "Decoding error!" ||
            res.message === "Your token expired!"
          ) {
            console.log("nu ai voie!");
          } else {
            data.id = res.id;
            this.$store.dispatch("addCheltuiala", data);
          }
        });
    },
    onSubmit(e) {
      console.log(this.action);
      if (this.action == "Add") {
        this.addCheltuiala();
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
