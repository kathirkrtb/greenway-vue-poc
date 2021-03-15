<template >
  <div
    class="container card card-cascade narrower mb-5"
    v-if="layoutName === 'default'"
  >
    <div class="col-md-3">
      <div class="view view-cascade py-3 gradient-card-header info-color-dark">
        <h6 class="mb-0">{{ title }}</h6>
      </div>
    </div>
    <div class="card-body">
      <slot />
    </div>
  </div>
  <template v-if="layoutName === 'plain'">
    <slot />
  </template>
</template>


<script>
export default {
  data() {
    return {
      title: "",
      layoutName: "",
    };
  },
  watch: {
    $route(to) {
      const { meta } = to;
      const { title, layoutName } = meta;
      this.title = title;
      this.layoutName = layoutName;
    },
  },
};
</script>
