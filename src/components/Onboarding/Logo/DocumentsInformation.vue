<template>
  <svg
    width="240"
    height="69"
    viewBox="0 0 240 69"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    @click="$emit('loadTagView', tag)"
  >
    <rect width="240" height="69" rx="34.5" fill="black" />
    <text
      v-if="completion"
      class="text-completion"
      x="30"
      y="30"
      font-size="14"
    >
      {{ tag }}
    </text>
    <text
      v-if="completion"
      class="text-completion"
      x="30"
      y="50"
      font-size="14"
    >
      {{ completion.totalImages }} Documents
    </text>
    <path d="M208.75 43.3205L223.75 34.6603L208.75 26" stroke="white" />
  </svg>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  emits: ["loadTagView"],
  props: {
    tag: String,
  },
  data() {
    return {
      completion: undefined,
    };
  },
  computed: {
    ...mapGetters({
      getCompletionByDecade: "getCompletionByDecade",
    }),
  },
  activated() {
    this.completion = this.getCompletionByDecade(this.decade);
    if (this.completion === undefined) {
      this.completion = {
        completion: 0,
      };
    }
  },
};
</script>

<style scoped>
.text-completion {
  font-weight: normal;
  fill: lightgray;
}
</style>
