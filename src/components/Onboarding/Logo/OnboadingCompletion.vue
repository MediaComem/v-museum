<template>
  <svg
    width="240"
    height="69"
    viewBox="0 0 240 69"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    @click="$emit('loadDecade', decade)"
  >
    <rect width="240" height="69" rx="34.5" fill="black" />
    <text
      v-if="completion"
      class="text-completion"
      x="30"
      y="30"
      font-size="14"
    >
      {{ decade }}
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
import { mapGetters, mapState } from "vuex";
export default {
  emits: ["loadDecade"],
  props: {
    decade: String,
  },
  watch: {
    completionData: {
      handler() {
        this.completion = this.getCompletionByDecade(this.decade);
      },
      deep: true,
    },
  },
  data() {
    return {
      completion: undefined,
    };
  },
  computed: {
    ...mapState(["completionData"]),
    ...mapGetters({
      getCompletionByDecade: "getCompletionByDecade",
      getImagesByDecade: "getImagesByDecade",
      getVisitedIndexByDecade: "getVisitedIndexByDecade",
    }),
  },
  activated() {
    this.completion = this.getCompletionByDecade(this.decade);
    if (this.completion === undefined) {
      this.completion = {
        completion: 0,
      };
    }

    const visited = this.getVisitedIndexByDecade(this.decade);
    let lastId = 0;
    if (visited !== undefined) {
      lastId = visited.lastId;
      this.$store.dispatch("insertSkipId", {
        decade: this.decade,
        id: lastId,
      });
    }

    const documents = this.getImagesByDecade(this.decade);
    if (documents === undefined) {
      this.$store.dispatch("initializeCarousel", {
        decade: this.decade,
        id: lastId,
      });
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
