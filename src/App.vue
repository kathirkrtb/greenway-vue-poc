<template>
  <nav class="navbar navbar-expand-lg">
    <div class="container-fluid">
      <a class="navbar-brand" href="#"
        ><img src="./assets/img/logo1.jpg" alt="logo" class="logo-img"
      /></a>
      <div class="topnav" id="myTopnav">
        <router-link to="/">Users List</router-link>
        <a href="#" class="router-link-active" @click="logout">Logout</a>
      </div>
    </div>
  </nav>
  <layout-default>
    <router-view />
  </layout-default>
</template>
<script>
import LayoutDefault from "./layouts/LayoutDefault.vue";
import { getCurrentInstance } from "vue";
import { useRouter } from "vue-router";

export default {
  components: {
    LayoutDefault,
  },
  setup() {
    const isShow = false;
    const router = useRouter();
    const $toast = getCurrentInstance().ctx.$toast;

    function logout() {
      localStorage.removeItem("_token");
      toast("success", "Logged out successfully!");
      router.push("/login");
    }
    function toast(type, message) {
      $toast.show(message, {
        type: type,
        position: "top-right",
      });
    }
    return {
      logout,
      isShow,
    };
  },
};
</script>