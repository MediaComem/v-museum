<template>
  <div v-if="!displayAllHistory" class="history-layout" :style="displayHistory">
    <div
      class="history-text"
      @click="displayAllHistory = true"
      style="z-index: 30"
    >
      <p class="history-value">{{ currentHistory.length }}</p>
    </div>
    <div class="history-display-image">
      <div
        style="position: absolute; left: 136px"
        :style="{ transform: 'translateX(' + -(44 * firstPosition) + 'px)' }"
        :class="{ 'move-image': firstPosition !== 0 }"
        class="history-image-element"
      >
        <img
          v-if="firstImage"
          :style="{ opacity: getOpacity(firstPosition) }"
          class="history-image display-image"
          @click="comeBackTo(firstImage, 1)"
          :src="firstImage.data"
        />
      </div>
      <div
        style="position: absolute; left: 136px"
        :style="{ transform: 'translateX(' + -(44 * secondPosition) + 'px)' }"
        :class="{ 'move-image': secondPosition !== 0 }"
        class="history-image-element"
      >
        <img
          v-if="secondImage"
          :style="{ opacity: getOpacity(secondPosition) }"
          class="history-image display-image"
          @click="comeBackTo(secondImage, 2)"
          :src="secondImage.data"
        />
      </div>
      <div
        style="position: absolute; left: 136px"
        :style="{ transform: 'translateX(' + -(44 * thirdPosition) + 'px)' }"
        :class="{ 'move-image': thirdPosition !== 0 }"
        class="history-image-element"
      >
        <img
          v-if="thirdImage"
          :style="{ opacity: getOpacity(thirdPosition) }"
          class="history-image display-image"
          @click="comeBackTo(thirdImage, 3)"
          :src="thirdImage.data"
        />
      </div>
      <div
        style="position: absolute; left: 136px"
        :style="{ transform: 'translateX(' + -(44 * forthPosition) + 'px)' }"
        :class="{ 'move-image': forthPosition !== 0 }"
        class="history-image-element"
      >
        <img
          v-if="forthImage"
          :style="{ opacity: getOpacity(forthPosition) }"
          class="history-image display-image"
          @click="comeBackTo(forthImage, 4)"
          :src="forthImage.data"
        />
      </div>
    </div>
  </div>

  <div v-if="displayAllHistory" class="history-layout" :style="fullHistory">
    <div v-for="(value, index) in currentHistory" :key="index">
      <div
        style="position: absolute; width: 61.33; height: 81px"
        :style="{ left: 69.33 * (index + 1) + 'px' }"
      >
        <img
          class="history-image-full"
          style="height: 69px; width: 61.33px;"
          @click="comeBackTo(value)"
          :src="value.data"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
export default {
  name: "History",
  props: {
    topPosition: Number,
    leftPosition: Number,
    fullWidth: Number,
  },
  data() {
    return {
      displayAllHistory: false,
      firstImage: undefined,
      firstPosition: 0,
      secondImage: undefined,
      secondPosition: 0,
      thirdImage: undefined,
      thirdPosition: 0,
      forthImage: undefined,
      forthPosition: 0,
      currentHistoryLength: 0,
    };
  },
  watch: {
    history: {
      handler(historyElement) {
        if (this.currentHistoryLength !== historyElement.length) {
          if (this.currentHistory.length % 4 === 1) {
            setTimeout(() => (this.secondImage = undefined), 1000);
            this.firstPosition = 0;
            this.secondPosition = this.secondPosition + 1;
            this.thirdPosition = this.thirdPosition + 1;
            this.forthPosition = this.forthPosition + 1;
            setTimeout(
              () =>
                (this.firstImage = historyElement[historyElement.length - 1]),
              1000
            );
          }
          if (this.currentHistory.length % 4 === 2) {
            setTimeout(() => (this.thirdImage = undefined), 1000);
            this.secondPosition = 0;
            this.firstPosition = this.firstPosition + 1;
            this.thirdPosition = this.thirdPosition + 1;
            this.forthPosition = this.forthPosition + 1;
            setTimeout(
              () =>
                (this.secondImage = historyElement[historyElement.length - 1]),
              1000
            );
          }
          if (this.currentHistory.length % 4 === 3) {
            setTimeout(() => (this.forthImage = undefined), 1000);
            this.thirdPosition = 0;
            this.firstPosition = this.firstPosition + 1;
            this.secondPosition = this.secondPosition + 1;
            this.forthPosition = this.forthPosition + 1;
            setTimeout(
              () =>
                (this.thirdImage = historyElement[historyElement.length - 1]),
              1000
            );
          }
          if (this.currentHistory.length % 4 === 0) {
            setTimeout(() => (this.firstImage = undefined), 1000);
            this.forthPosition = 0;
            this.firstPosition = this.firstPosition + 1;
            this.secondPosition = this.secondPosition + 1;
            this.thirdPosition = this.thirdPosition + 1;
            setTimeout(
              () =>
                (this.forthImage = historyElement[historyElement.length - 1]),
              1000
            );
          }
          this.currentHistoryLength = historyElement.length;
        }
      },
      deep: true,
    },
  },
  methods: {
    comeBackTo(historyElement, position) {
      this.displayAllHistory = false;
      switch (position) {
        case 1:
          break;
        case 2:
          break;
        case 3:
          break;
        case 4:
          break;
      }
      this.$router.push({
       path: `/selector/${historyElement.decade}/${historyElement.index}`,
       query: {history: true}
      });
    },
    getOpacity(position) {
      if (position === 0) {
        return "0.8";
      }
      if (position === 1) {
        return "0.6";
      }
      if (position === 2) {
        return "0.3";
      }
      return "0";
    },
  },
  computed: {
    displayHistory() {
      return {
        height: "53px",
        width: "184px",
        top: this.topPosition + "px",
        left: this.leftPosition + "px",
      };
    },
    fullHistory() {
      return {
        height: "81px",
        width: "100vw",
        top: this.topPosition - 28 + "px",
        left: "0px",
        overflow: "scroll",
      };
    },
    ...mapGetters({
      currentHistory: "getHistory",
    }),
    ...mapState(["history"]),
  },
  mounted() {
    const element = this.currentHistory.slice(-3);
    this.currentHistoryLength = this.currentHistory.length;
    switch (element.length) {
      case 1: this.firstImage = element[0];
              this.firstPosition = 0;
              break;
      case 2: this.firstImage = element[0];
              this.firstPosition = 1;
              this.secondImage = element[1];
              this.secondPosition = 0;
              break;
      case 3: this.firstImage = element[0];
              this.firstPosition = 2;
              this.secondImage = element[1];
              this.secondPosition = 1;
              this.thirdImage = element[0];
              this.thirdPosition = 0;
              break;
    }
  }
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
  width: 45px;
  height: 100%;
}

.history-display-image {
  display: block;
  position: absolute;
  background-color: black;
  width: 133px;
  height: 100%;
  left: 0px;
}

.history-image-element {
  display: block;
  position: absolute;
  width: 41px;
  height: 100%;
}

.history-value {
  width: 41px;
  color: lightgray;
  font-size: medium;
  position: absolute;
}

.history-image {
  object-fit: none;
  position: absolute;
  top: 4px;
  left: 4px;
}

.history-image-full {
  object-fit: none;
  position: absolute;
  top: 6px;
  left: 4px;
}

.history-image:hover {
  opacity: 1;
}

.move-image {
  transition: transform 1s linear;
}

.display-image {
  animation: createBox 0.25s;
  height: 45px;
  width: 40px;
}
@keyframes createBox {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}
</style>
