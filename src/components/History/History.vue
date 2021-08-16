<template>
  <div class="history-layout" :style="displayHistory">
    <div class="history-element">
      <p class="history-value">{{ currentHistory.length }}</p>
    </div>
    <div class="history-element" style="left: 100px;">
      <img
        v-if="currentHistory.length > 2"
        class="history-image"
        style="opacity: 0.3;"
        @click="comeBackTo(currentHistory.length - 3)"
        :src="
          currentHistory[currentHistory.length - 3].data[
            currentHistory[currentHistory.length - 3].index
          ].imagePaths.square
        "
      />
    </div>
    <div class="history-element" style="left: 200px;">
      <img
        v-if="currentHistory.length > 1"
        class="history-image"
        style="opacity: 0.5;"
        @click="comeBackTo(currentHistory.length - 2)"
        :src="
          currentHistory[currentHistory.length - 2].data[
            currentHistory[currentHistory.length - 2].index
          ].imagePaths.square
        "
      />
    </div>
    <div class="history-element" style="left: 300px;">
      <img
        class="history-image"
        @click="comeBackTo(currentHistory.length - 1)"
        v-if="currentHistory.length > 0"
        :src="
          currentHistory[currentHistory.length - 1].data[
            currentHistory[currentHistory.length - 1].index
          ].imagePaths.square
        "
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "History",
  props: {
    topPosition: Number,
    leftPosition: Number,
  },
  methods: {
    comeBackTo(historyIndex) {
      console.log(this.currentHistory[historyIndex]);
      // TODO: Implemenet come back to the right page when transition ready
    }
  },
  computed: {
    displayHistory() {
      let history = 0;
      history = this.currentHistory.length < 3 ? this.currentHistory.length : 3;
      return {
        top: this.topPosition + "px",
        left: this.leftPosition + "px",
        width: 100 * (history + 1) + "px",
      };
    },
    ...mapGetters({
      currentHistory: "getHistory",
    }),
  },
};
</script>

<style scoped>
.history-layout {
  display: block;
  background-color: black;
  height: 100px;
  position: fixed;
  z-index: 15;
}

.history-element {
  display: block;
  position: absolute;
  background-color: black;
  width: 100px;
  height: 100%;
}

.history-value {
  width: 100px;
  color: lightgray;
  font-size: xx-large;
  position: absolute;
}

.history-image {
  height: 85px;
  width: 85px;
  object-fit: none;
  position: absolute;
  top: 7px;
  left: 7px;
}
</style>
