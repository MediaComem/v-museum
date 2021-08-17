<template>
  <div v-if="!displayAllHistory" class="history-layout" :style="displayHistory">
    <div class="history-text" @click="displayAllHistory = true">
      <p class="history-value">{{ currentHistory.length }}</p>
    </div>
    <div class="history-display-image">
      <div style="position: absolute;">
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
      <div style="position: absolute; left: 100px;">
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
      <div style="position: absolute; left: 200px;">
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
  </div>
  <div v-if="displayAllHistory" class="history-layout" :style="fullHistory">
    <div class="history-text" @click="displayAllHistory = false">
      <p class="history-value">{{ currentHistory.length }}</p>
    </div>
    <div v-for="(value, index) in currentHistory" :key="index">
      <div
        style="position: absolute;"
        :style="{ left: 100 * (index + 1) + 'px' }"
      >
        <img
          class="history-image"
          @click="comeBackTo(index)"
          :src="value.data[value.index].imagePaths.square"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "History",
  data() {
    return {
      displayAllHistory: false,
    };
  },
  props: {
    topPosition: Number,
    leftPosition: Number,
    fullWidth: Number,
  },
  methods: {
    comeBackTo(historyIndex) {
      this.displayAllHistory = false;
      console.log(this.currentHistory[historyIndex]);
      // TODO: Implemenet come back to the right page when transition ready
    },
  },
  computed: {
    displayHistory() {
      return {
        height: "100px",
        width: "400px",
        top: this.topPosition + "px",
        left: this.leftPosition + "px",
      };
    },
    fullHistory() {
      return {
        height: "100px",
        width: this.fullWidth + "px",
        top: this.topPosition + "px",
        left: "0px",
        overflow: "scroll",
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
  position: fixed;
  z-index: 15;
}

.history-text {
  display: block;
  position: absolute;
  background-color: black;
  width: 100px;
  height: 100%;
}

.history-display-image {
  display: block;
  position: absolute;
  background-color: black;
  width: 300px;
  height: 100%;
  left: 100px;
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
