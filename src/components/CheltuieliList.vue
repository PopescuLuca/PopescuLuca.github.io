<template>
  <div>
    <h1>Componenta Cheltuieli List</h1>
    <add-edit-form :action="formAction" :cheltuiala="formCheltuiala" />
    <Cheltuieli
      @edit="editCheltuiala"
      :cheltuiala="elem"
      v-for="elem in cheltuieli"
      :key="elem.id"
    />
  </div>
</template>

<script>
import Cheltuieli from "./Cheltuieli.vue";
import AddEditForm from "./AddEditForm.vue";
import utils from "../utils";

export default {
  name: "Cheltuiali List",
  components: {
    AddEditForm,
    Cheltuieli,
  },
  data() {
    return {
      //cheltuieliList: [],
      formAction: "Add",
      formCheltuiala: {},
    };
  },
  created() {
    let url = utils.url;
    let requestParam = utils.globalRequestParameters;
    //if(isLoggedIn==true){
    if (!this.cheltuieli.length) {
      fetch(url + "cheltuieli", requestParam).then((res) =>
        res.json().then((res) => {
          res.forEach((element) => {
            let myDate = new Date(element.data._seconds * 1000);
            let s = myDate.getMonth() + 1;
            let myDateBun = myDate.getDate() + "-" + s + "-" + myDate.getFullYear();
            element.data = myDateBun;
          });

          this.$store.dispatch("fetchCheltuieli", res);
          //this.cheltuieliList = res;
        })
      );
    }
  },
  computed: {
    cheltuieli() {
      return this.$store.state.cheltuieli;
    },
  },
  methods: {
    editCheltuiala(cheltuiala) {
      this.formAction = "Edit";
      this.formCheltuiala = cheltuiala;
    },
  },
};
</script>

<style></style>
