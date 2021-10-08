<template>
  <div
    v-if="!isFullHistory"
    class="history-layout open-animation"
    :style="isAnimated ? fullHistory : displayHistory"
  >
    <div v-if="!isAnimated">
      <div
        class="history-text"
        style="z-index: 30"
        @click="sendOpenFullHistory()"
      >
        <p class="history-value">{{ currentHistory.length }}</p>
      </div>
      <div v-if="currentHistory.length <= 2">
        <div>
          <div
            style="position: absolute; left: 45px"
            class="history-image-element"
          >
            <img
              v-if="firstImage"
              :class="getOpacityFirstPosition"
              class="history-image display-image"
              @click="comeBackTo(firstImage)"
              :src="firstImage.data"
            />
          </div>
        </div>
        <div>
          <div
            style="position: absolute; left: 90px"
            class="history-image-element"
          >
            <img
              v-if="secondImage"
              :class="getOpacitySecondPosition"
              class="history-image display-image"
              @click="comeBackTo(secondImage)"
              :src="secondImage.data"
            />
          </div>
        </div>
        <div>
          <div
            style="position: absolute; left: 135px"
            class="history-image-element"
          >
            <img
              v-if="thirdImage"
              class="history-image display-image third-image-opacity"
              @click="comeBackTo(thirdImage)"
              :src="thirdImage.data"
            />
          </div>
        </div>
      </div>
      <div v-if="currentHistory.length > 2">
        <div
          style="position: absolute; left: 135px"
          :style="{ transform: 'translateX(' + -(45 * firstPosition) + 'px)' }"
          :class="{ 'move-image': firstPosition !== 0 }"
          class="history-image-element"
          @mouseover="hoverElement"
        >
          <img
            v-if="firstImage"
            class="history-image display-image"
            :class="getOpacityFullFirstPosition"
            @click="comeBackTo(firstImage)"
            :src="firstImage.data"
          />
        </div>
        <div
          style="position: absolute; left: 135px"
          :style="{ transform: 'translateX(' + -(45 * secondPosition) + 'px)' }"
          :class="{ 'move-image': secondPosition !== 0 }"
          class="history-image-element"
        >
          <img
            v-if="secondImage"
            class="history-image display-image"
            :class="getOpacityFullSecondPosition"
            @click="comeBackTo(secondImage)"
            :src="secondImage.data"
          />
        </div>
        <div
          style="position: absolute; left: 135px"
          :style="{ transform: 'translateX(' + -(45 * thirdPosition) + 'px)' }"
          :class="{ 'move-image': thirdPosition !== 0 }"
          class="history-image-element"
        >
          <img
            v-if="thirdImage"
            class="history-image display-image"
            :class="getOpacityFullThirdPosition"
            @click="comeBackTo(thirdImage)"
            :src="thirdImage.data"
          />
        </div>
        <div
          style="position: absolute; left: 135px"
          :style="{ transform: 'translateX(' + -(45 * forthPosition) + 'px)' }"
          :class="{ 'move-image': forthPosition !== 0 }"
          class="history-image-element"
        >
          <img
            v-if="forthImage"
            class="history-image display-image"
            :class="getOpacityFullForthPosition"
            @click="comeBackTo(forthImage)"
            :src="forthImage.data"
          />
        </div>
      </div>
    </div>
  </div>

  <div v-if="isFullHistory" class="history-layout" :style="fullHistory">
    <div class="left-arrow" @click="leftMove()" />
    <div class="full-history-display">
      <div v-for="(value, index) in currentHistory" :key="index">
        <div
          style="position: absolute; width: 64; height: 81px"
          :style="{
            left: 68 * index + 'px',
            transform: 'translateX(' + -(68 * position) + 'px)',
          }"
        >
          <img
            class="history-image-full"
            style="height: 69px; width: 60px;"
            @click="comeBackTo(value)"
            :src="value.data"
          />
        </div>
      </div>
    </div>
    <div class="right-arrow" @click="rightMove()" />
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
    displayAllHistory: Boolean,
  },
  data() {
    return {
      firstImage: undefined,
      firstPosition: 0,
      secondImage: undefined,
      secondPosition: 0,
      thirdImage: undefined,
      thirdPosition: 0,
      forthImage: undefined,
      forthPosition: 0,
      currentHistoryLength: 0,
      position: 0,
      isAnimated: false,
    };
  },
  watch: {
    isFullHistory() {
      if (!this.isFullHistory) {
        setTimeout(() => {
          this.isAnimated = false;
      }, 100);
      }
    },
    history: {
      handler(historyElement) {
        // The store contains enough elements to fill the component?
        if (historyElement.length > 3) {
          if (this.currentHistoryLength !== historyElement.length) {
            // Depending of the position of the last element, move other images and add the new image.
            // Each component move depending of its own position.
            // The last position disappers and the new one appears
            // The timeout is used to manage the display when the move animation is done
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
                  (this.secondImage =
                    historyElement[historyElement.length - 1]),
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
        } else {
          // Load the available images
          this.loadImages(historyElement);
        }
      },
      deep: true,
    },
  },
  methods: {
    sendOpenFullHistory() {
      this.isAnimated = true;
      setTimeout(() => {
        this.$emit("openFullHistory");
      }, 300);
    },
    leftMove() {
      if (this.position > 0) {
        this.position = this.position - 1;
      }
    },
    rightMove() {
      if (
        this.position <=
        this.currentHistory.length - (this.fullWidth / 68 - 1)
      ) {
        this.position = this.position + 1;
      }
    },
    comeBackTo(historyElement) {
      this.$router.push({
        path: `/selector/${historyElement.decade}/${historyElement.index}`,
        query: { history: true },
      });
      this.$emit("closeFullHistory");
    },
    loadImages(historyElement) {
      const element = historyElement.slice(-3);
      this.currentHistoryLength = this.currentHistory.length;
      switch (element.length) {
        case 1:
          this.firstImage = element[0];
          this.firstPosition = 0;
          break;
        case 2:
          this.firstImage = element[0];
          this.firstPosition = 1;
          this.secondImage = element[1];
          this.secondPosition = 0;
          break;
        default:
          this.firstImage = element[0];
          this.firstPosition = 2;
          this.secondImage = element[1];
          this.secondPosition = 1;
          this.thirdImage = element[2];
          this.thirdPosition = 0;
          break;
      }
    },
  },
  computed: {
    isFullHistory() {
      return this.displayAllHistory;
    },
    displayHistory() {
      return {
        height: "53px",
        width:
          this.currentHistory.length < 3
            ? (this.currentHistory.length + 1) * 45 + "px"
            : "180px",
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
      };
    },
    getOpacityFirstPosition() {
      return {
        "third-image-opacity": this.currentHistory.length === 1,
        "second-image-opacity": this.currentHistory.length === 2,
        "first-image-opacity": this.currentHistory.length > 2,
      };
    },
    getOpacitySecondPosition() {
      return {
        "third-image-opacity": this.currentHistory.length === 2,
        "second-image-opacity": this.currentHistory.length > 2,
      };
    },
    getOpacityFullFirstPosition() {
      return {
        "third-image-opacity": this.firstPosition === 0,
        "second-image-opacity": this.firstPosition === 1,
        "first-image-opacity": this.firstPosition === 2,
        "final-opacity": this.firstPosition === 3,
      };
    },
    getOpacityFullSecondPosition() {
      return {
        "third-image-opacity": this.secondPosition === 0,
        "second-image-opacity": this.secondPosition === 1,
        "first-image-opacity": this.secondPosition === 2,
        "final-opacity": this.secondPosition === 3,
      };
    },
    getOpacityFullThirdPosition() {
      return {
        "third-image-opacity": this.thirdPosition === 0,
        "second-image-opacity": this.thirdPosition === 1,
        "first-image-opacity": this.thirdPosition === 2,
        "final-opacity": this.thirdPosition === 3,
      };
    },
    getOpacityFullForthPosition() {
      return {
        "third-image-opacity": this.forthPosition === 0,
        "second-image-opacity": this.forthPosition === 1,
        "first-image-opacity": this.forthPosition === 2,
        "final-opacity": this.forthPosition === 3,
      };
    },
    ...mapGetters({
      currentHistory: "getHistory",
    }),
    ...mapState(["history"]),
  },
  mounted() {
    this.loadImages(this.currentHistory);
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
  width: 45px;
  height: 100%;
}

.history-display-image {
  display: block;
  position: absolute;
  background-color: black;
  width: 133px;
  height: 100%;
  left: 45px;
}

.history-image-element {
  display: block;
  position: absolute;
  width: 45px;
  height: 100%;
}

.history-value {
  display: flex;
  justify-content: center;
  width: 41px;
  color: lightgray;
  font-size: medium;
  position: absolute;
  margin-left: 2px;
}

.history-image {
  object-fit: none;
  position: absolute;
  top: 4px;
  left: 2.5px;
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

.first-image-opacity {
  opacity: 0.3;
}

.second-image-opacity {
  opacity: 0.6;
}

.third-image-opacity {
  opacity: 0.8;
}

.final-opacity {
  opacity: 0.3;
}

.open-animation {
  transition: height 0.3s linear, width 0.3s linear, top 0.3s linear, left 0.3s linear;
}

@media (pointer: fine) {
  .full-history-display {
    position: absolute;
    display: block;
    height: inherit;
    overflow-y: scroll;
    left: 2.5vw;
    width: 95vw;
  }

  .left-arrow {
    position: absolute;
    display: block;
    height: inherit;
    width: 2.5vw;
    background: url("../../assets/image-selector/vector-left.png");
    background-repeat: no-repeat;
    background-size: 20%;
    background-position-x: 0.5vw;
    background-position-y: 50%;
  }

  .right-arrow {
    left: 97.5vw;
    position: absolute;
    display: block;
    height: inherit;
    width: 2.5vw;
    background: url("../../assets/image-selector/vector-right.png");
    background-repeat: no-repeat;
    background-size: 20%;
    background-position-x: 0.5vw;
    background-position-y: 50%;
  }
}

@media (pointer: coarse) {
  .full-history-display {
    position: absolute;
    display: block;
    height: inherit;
    overflow-y: scroll;
    width: 100vw;
  }

  .left-arrow {
    position: absolute;
    display: block;
    height: 0vh;
    width: 0vw;
  }

  .right-arrow {
    left: 97.5vw;
    position: absolute;
    display: block;
    height: 0vh;
    width: 0vw;
  }
}

@media (pointer: none) {
  .full-history-display {
    position: absolute;
    display: block;
    height: inherit;
    overflow-y: scroll;
    width: 100vw;
  }

  .left-arrow {
    position: absolute;
    display: block;
    height: 0vh;
    width: 0vw;
  }

  .right-arrow {
    left: 97.5vw;
    position: absolute;
    display: block;
    height: 0vh;
    width: 0vw;
  }
}

@media (any-pointer: coarse) {
  .first-image-opacity:hover {
    opacity: 0.3;
  }
  .second-image-opacity:hover {
    opacity: 0.6;
  }
  .third-image-opacity:hover {
    opacity: 0.8;
  }
}

@media (hover: hover) {
  .first-image-opacity:hover {
    opacity: 1;
  }
  .second-image-opacity:hover {
    opacity: 1;
  }
  .third-image-opacity:hover {
    opacity: 1;
  }
}
</style>
