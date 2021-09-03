<template>
  <svg
    width="240"
    height="69"
    viewBox="0 0 240 69"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="240" height="69" rx="34.5" fill="black" />
    <completion
      :decade="decade"
      :height="69"
      :width="69"
      :topPosition="10"
      :leftPosition="5"
      :emptyColor="'gray'"
      :completeColor="'lightgray'"
    />
    <text v-if="completion" class="text" x="70" y="30" font-size="14">
      {{ completion.totalImages }} Documents
    </text>
    <text v-if="completion" class="text" x="70" y="50" font-size="14">
      {{ completion.completion }}% discovered
    </text>
    <path d="M208.75 43.3205L223.75 34.6603L208.75 26" stroke="white" />
  </svg>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import Completion from "../../Completion/Completion.vue";
export default {
  components: { Completion },
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
    }),
  },
  mounted() {
    this.completion = this.getCompletionByDecade(this.decade);
    if (this.completion === undefined) {
      this.completion = {
        completion: 0,
      };
    }

    const documents = this.getImagesByDecade(this.decade);
    if (documents === undefined) {
      this.$store.dispatch("initializeCarousel", {
        decade: this.decade,
      });
    }
  },
};
</script>

<style scoped>
.text {
  font-weight: normal;
  stroke: lightgray;
}
</style>
