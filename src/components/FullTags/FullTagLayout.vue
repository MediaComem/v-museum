<template>
  <div class="page-size">
    <full-tag-header :tag="tagValue"/>
    <full-tag-page :tags="tags[tagValue]" />
  </div>
</template>

<script>
import FullTagHeader from "./FullTagHeader.vue";
import FullTagPage from "./FullTagPage.vue";

import tags from "../../assets/data/tags.json";

export default {
  components: { FullTagHeader, FullTagPage },
  data() {
    return {
      tags: tags,
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
