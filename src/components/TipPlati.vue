<template>
  <div>
    <h1>Componenta TipPlati List</h1>
    <add-edit-form-plata :action="formAction" :tipPlata="formPlata" />
    <TipPlata
      @edit="editPlata"
      :tipPlata="elem"
      v-for="elem in tipPlati"
      :key="elem.id"
    />
  </div>
</template>

<script>
import TipPlata from "./TipPlata.vue";
import AddEditFormPlata from "./AddEditFormPlata.vue";
import utils from "../utils";

export default {
  name: "TipPlati lista",
  components: {
    AddEditFormPlata,
    TipPlata,
  },
  data() {
    return {
      //tipPlatiList: [],
      formAction: "Add",
      formPlata: {},
    };
  },
  created() {
    let url = utils.url;
    let requestParam = utils.globalRequestParameters;
    //if(isLoggedIn==true){
    if (!this.tipPlati.length) {
      fetch(url + "tipPlata", requestParam).then((res) =>
        res.json().then((res) => {
          this.$store.dispatch("fetchTipPlata", res);
          //this.tipPlatiList = res;
        })
      );
    }
  },
  computed: {
    tipPlati() {
      return this.$store.state.tipPlati;
    },
  },
  methods: {
    editPlata(tipPlata) {
      this.formAction = "Edit";
      this.formPlata = tipPlata;
    },
  },
};
</script>

<style></style>
