<template>
  <div class="page-size">
    <full-tag-header :tag="tagValue"/>
    <full-tag-page :tag="tagValue" />
  </div>
</template>

<script>
import FullTagHeader from "./FullTagHeader.vue";
import FullTagPage from "./FullTagPage.vue";

export default {
  components: { FullTagHeader, FullTagPage },
  data() {
    return {
      tagValue: "Fly",
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
