<template>
  <div class="page-size">
  {{tagValue}}
    <full-tag-header :tag="tagValue" />
    <full-tag-page :tag="tagValue" />
  </div>
</template>

<script>
import FullTagHeader from "./FullTagHeader.vue";
import FullTagPage from "./FullTagPage.vue";

export default {
  components: { FullTagHeader, FullTagPage },
  beforeRouteEnter(to, from, next) {
    console.log(to.query)
    next((vm) => {
      vm.tagValue = decodeURIComponent(to.query.tag);
    });
  },
  data() {
    return {
      tagValue: "",
    };
  },
};
</script>

<style scoped>
.page-size {
  height: 100vh;
  width: 100vw;
}
</style>
