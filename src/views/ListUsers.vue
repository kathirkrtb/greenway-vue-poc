<template>
  <div class="pull-right">
    <router-link to="/add-user" class="btn btn-success pull-right"
      ><i class="fa fa-plus"></i> Add New</router-link
    ><br /><br />
  </div>
  <div class="table-responsive">
    <table class="table table-bordered table-striped">
      <thead class="">
        <tr>
          <th scope="col">S.No</th>
          <th scope="col">Name</th>
          <th scope="col">Email</th>
          <th scope="col">Phone Number</th>
          <th scope="col">ID card Type</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="users.length">
          <tr v-for="(post, index) in users" v-bind:key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ post.name }}</td>
            <td>{{ post.email }}</td>
            <td>{{ post.mobile }}</td>
            <td>{{ post.id_card_type }}</td>
            <td>
              <router-link
                :to="{ name: 'EditUser', params: { id: post._id } }"
                class="btn btn-info btn-sm"
                ><i class="fa fa-pencil"></i
              ></router-link>
            </td>
          </tr>
        </template>
        <template v-if="loading">
          <tr>
            <th colspan="6" class="text-center">Data Loading..</th>
          </tr>
        </template>
        <template v-if="!loading && users.length === 0">
          <tr>
            <td colspan="6" class="text-center">No Data Found..</td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { getCurrentInstance } from "vue";

import api from "../services/api";

export default {
  name: "list",
  components: {},
  setup() {
    const users = ref([]);
    const loading = ref(true);
    const $toast = getCurrentInstance().ctx.$toast;

    function fetchData() {
      loading.value = true;

      api
        .common("")
        .get()
        .then(({ data }) => {
          users.value = data.data;
          loading.value = false;
        })
        .catch(function (error) {
          //show toaster
          toast("error", "Error occured while loading data. Please try again!");
          error.value = error;
        });
    }

    onMounted(() => {
      fetchData();
    });

    function toast(type, message) {
      $toast.show(message, {
        type: type,
        position: "top-right",
      });
    }

    return {
      users,
      loading,
    };
  },
};
</script>
