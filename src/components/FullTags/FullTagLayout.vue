<template>
  <div style="height: 100vh">
    <full-tag-header :tag="'Fly'"/>
    <full-tag-page :tags="tags['Fly']" />
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
    };
  },
};
</script>

<style></style>
