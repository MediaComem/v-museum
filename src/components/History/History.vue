<template>
  <div
    v-if="!isFullHistory"
    class="history-layout open-animation clickable-without-hover"
    :style="isAnimated ? fullHistory : displayHistory"
    @touchstart="disableZoom"
  >
    <div v-if="!isAnimated">
      <div
        class="history-text"
        style="z-index: 30"
        :style="historyTextWidth"
        @click="sendOpenFullHistory()"
      >
        <p class="history-value" :style="historyValueDisplay">{{ currentHistory.length }}</p>
      </div>
      <div v-if="currentHistory.length <= 2">
        <div>
          <div
            :style="{position: 'absolute', left: isSpecialDevice ? '200px' : '45px', width: isSpecialDevice ? '200px' : '45px'}"
            class="history-image-element"
          >
            <img
              v-if="firstImage"
              :class="getOpacityFirstPosition"
              class="history-image display-image"
              :style="{height: isSpecialDevice ? '195px' : '45px', width: isSpecialDevice ? '190px' : '40px'}"
              @click="comeBackTo(firstImage)"
              :src="firstImage.data"
            />
          </div>
        </div>
        <div>
          <div
            :style="{position: 'absolute', left: isSpecialDevice ? '400px' : '90px', width: isSpecialDevice ? '200px' : '45px'}"
            class="history-image-element"
          >
            <img
              v-if="secondImage"
              :class="getOpacitySecondPosition"
              class="history-image display-image"
              :style="{height: isSpecialDevice ? '195px' : '45px', width: isSpecialDevice ? '190px' : '40px'}"
              @click="comeBackTo(secondImage)"
              :src="secondImage.data"
            />
          </div>
        </div>
        <div>
          <div
            :style="{position: 'absolute', left: isSpecialDevice ? '600px' : '135px', width: isSpecialDevice ? '200px' : '45px'}"
            class="history-image-element"
          >
            <img
              v-if="thirdImage"
              class="history-image display-image third-image-opacity"
              :style="{height: isSpecialDevice ? '195px' : '45px', width: isSpecialDevice ? '190px' : '40px'}"
              @click="comeBackTo(thirdImage)"
              :src="thirdImage.data"
            />
          </div>
        </div>
      </div>
      <div v-if="currentHistory.length > 2">
        <div
          style="position: absolute"
          :style="{ transform: 'translateX(' + -((isSpecialDevice ? 200 : 45) * firstPosition) + 'px)', left: isSpecialDevice ? '600px' : '135px', width: isSpecialDevice ? '200px' : '45px' }"
          :class="{ 'move-image': firstPosition !== 0 }"
          class="history-image-element"
          @mouseover="hoverElement"
        >
          <img
            v-if="firstImage"
            class="history-image display-image"
            :style="{height: isSpecialDevice ? '195px' : '45px', width: isSpecialDevice ? '190px' : '40px'}"
            :class="getOpacityFullFirstPosition"
            @click="comeBackTo(firstImage)"
            :src="firstImage.data"
          />
        </div>
        <div
          style="position: absolute;"
          :style="{ transform: 'translateX(' + -((isSpecialDevice ? 200 : 45) * secondPosition) + 'px)', left: isSpecialDevice ? '600px' : '135px', width: isSpecialDevice ? '200px' : '45px' }"
          :class="{ 'move-image': secondPosition !== 0 }"
          class="history-image-element"
        >
          <img
            v-if="secondImage"
            class="history-image display-image"
            :style="{height: isSpecialDevice ? '195px' : '45px', width: isSpecialDevice ? '190px' : '40px'}"
            :class="getOpacityFullSecondPosition"
            @click="comeBackTo(secondImage)"
            :src="secondImage.data"
          />
        </div>
        <div
          style="position: absolute;"
          :style="{ transform: 'translateX(' + -((isSpecialDevice ? 200 : 45) * thirdPosition) + 'px)', left: isSpecialDevice ? '600px' : '135px', width: isSpecialDevice ? '200px' : '45px' }"
          :class="{ 'move-image': thirdPosition !== 0 }"
          class="history-image-element"
        >
          <img
            v-if="thirdImage"
            class="history-image display-image"
            :style="{height: isSpecialDevice ? '195px' : '45px', width: isSpecialDevice ? '190px' : '40px'}"
            :class="getOpacityFullThirdPosition"
            @click="comeBackTo(thirdImage)"
            :src="thirdImage.data"
          />
        </div>
        <div
          style="position: absolute;"
          :style="{ transform: 'translateX(' + -((isSpecialDevice ? 200 : 45) * forthPosition) + 'px)', left: isSpecialDevice ? '600px' : '135px', width: isSpecialDevice ? '200px' : '45px' }"
          :class="{ 'move-image': forthPosition !== 0 }"
          class="history-image-element"
        >
          <img
            v-if="forthImage"
            class="history-image display-image"
            :style="{height: isSpecialDevice ? '195px' : '45px', width: isSpecialDevice ? '190px' : '40px'}"
            :class="getOpacityFullForthPosition"
            @click="comeBackTo(forthImage)"
            :src="forthImage.data"
          />
        </div>
      </div>
    </div>
  </div>

  <div v-if="isFullHistory" class="history-layout clickable-without-hover" :style="fullHistory">
    <div class="full-history-lenght history-text" :style="historyTextWidth" @click="closeFullHistory">
      <p class="history-value-full" :style="historyValueFullSize">{{ currentHistory.length }}</p>
    </div>
    <div class="left-arrow" @click="leftMove()" />
    <div class="full-history-display" :style="fullHistoryDisplaySize">
      <div v-for="(value, index) in currentHistory" :key="index">
        <div
          style="position: absolute; width: 64; height: 81px"
          :style="{
            left: isSpecialDevice ? 204 * index + 'px': 68 * index + 'px',
            transform: 'translateX(' + -(68 * position) + 'px)',
          }"
        >
          <img
            class="history-image-full"
            :style="{height: isSpecialDevice ? '292px' : '69px', width: isSpecialDevice ? '190px' : '60px', 'margin-top': isSpecialDevice ? '-10px' : '0px'}"
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
    isSpecialDevice: Boolean,
  },
  data() {
    return {
      firstImage: undefined,
      firstPosition: -1,
      secondImage: undefined,
      secondPosition: -1,
      thirdImage: undefined,
      thirdPosition: -1,
      forthImage: undefined,
      forthPosition: -1,
      nextPosition: 1,
      position: 0,
      isAnimated: false,
      displayAllHistory: false,
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
          // Depending of the position of the last element, move other images and add the new image.
          // Each component move depending of its own position.
          // The last position disappers and the new one appears
          // The timeout is used to manage the display when the move animation is done
          if (this.nextPosition === 1) {
            setTimeout(() => (this.secondImage = undefined), 1000);
            this.firstPosition = 0;
            this.nextPosition = 2;
            this.secondPosition = this.secondPosition + 1;
            this.thirdPosition = this.thirdPosition + 1;
            this.forthPosition = this.forthPosition + 1;
            setTimeout(
              () =>
                (this.firstImage = historyElement[historyElement.length - 1]),
              1000
            );
            return;
          }
          if (this.nextPosition === 2) {
            setTimeout(() => (this.thirdImage = undefined), 1000);
            this.secondPosition = 0;
            this.nextPosition = 3;
            this.firstPosition = this.firstPosition + 1;
            this.thirdPosition = this.thirdPosition + 1;
            this.forthPosition = this.forthPosition + 1;
            setTimeout(
              () =>
                (this.secondImage = historyElement[historyElement.length - 1]),
              1000
            );
            return;
          }
          if (this.nextPosition === 3) {
            setTimeout(() => (this.forthImage = undefined), 1000);
            this.thirdPosition = 0;
            this.nextPosition = 4;
            this.firstPosition = this.firstPosition + 1;
            this.secondPosition = this.secondPosition + 1;
            this.forthPosition = this.forthPosition + 1;
            setTimeout(
              () =>
                (this.thirdImage = historyElement[historyElement.length - 1]),
              1000
            );
            return;
          }
          if (this.nextPosition === 4) {
            setTimeout(() => (this.firstImage = undefined), 1000);
            this.forthPosition = 0;
            this.nextPosition = 1;
            this.firstPosition = this.firstPosition + 1;
            this.secondPosition = this.secondPosition + 1;
            this.thirdPosition = this.thirdPosition + 1;
            setTimeout(
              () =>
                (this.forthImage = historyElement[historyElement.length - 1]),
              1000
            );
            return;
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
    disableZoom(event) {
      if (event.touches.length >= 2) {
        event.preventDefault();
      }
    },
    sendOpenFullHistory() {
      this.isAnimated = true;
      setTimeout(() => {
        this.displayAllHistory = true;
        this.$store.dispatch('updateFullHistory', {
          isOpen: true,
        });
      }, 300);
    },
    closeFullHistory() {
      this.displayAllHistory = false;
      this.$store.dispatch('updateFullHistory', {
        isOpen: false,
      });
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
        path: `/canvas`,
        query: {
          imageId: encodeURIComponent(historyElement.imageId),
          tag: encodeURIComponent(historyElement.tag),
        },
      });
      this.displayAllHistory = false;
      this.$store.dispatch('updateFullHistory', {
        isOpen: false,
      });
    },
    loadImages(historyElement) {
      const element = historyElement.slice(-3);
      switch (element.length) {
        case 1:
          this.firstImage = element[0];
          this.firstPosition = 0;
          this.nextPosition = 2;
          break;
        case 2:
          this.firstImage = element[0];
          this.firstPosition = 1;
          this.secondImage = element[1];
          this.secondPosition = 0;
          this.nextPosition = 3;
          break;
        default:
          this.firstImage = element[0];
          this.firstPosition = 2;
          this.secondImage = element[1];
          this.secondPosition = 1;
          this.thirdImage = element[2];
          this.thirdPosition = 0;
          this.nextPosition = 4;
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
        height: this.isSpecialDevice ? '200px' :"53px",
        width:
          this.currentHistory.length < 3
            ? (this.currentHistory.length + 1) * (this.isSpecialDevice ? 200 : 45) + "px"
            : this.isSpecialDevice ? '800px' : "180px",
        top: this.isSpecialDevice ? this.topPosition + 200 + "px" : this.topPosition  + "px",
        left: this.leftPosition + "px",
      };
    },
    fullHistory() {
      return {
        height: this.isSpecialDevice ? '300px' : "81px",
        width: this.fullWidth + 'px',
        top: this.isSpecialDevice ? this.topPosition + 172 + "px" : this.topPosition - 28 + "px",
        left: "0px",
      };
    },
    fullHistoryDisplaySize() {
      if (this.isSpecialDevice) {
        return {
          width: this.fullWidth - 200 + 'px',
          left: '200px',
        };
      }
      return {};
    },
    historyTextWidth() {
      return {
        'width': this.isSpecialDevice ? '200px' : '45px',
      }
    },
    historyValueDisplay() {
      return {
        width: this.isSpecialDevice ? '190px' : '41px',
        height: this.isSpecialDevice ? '200px' : "53px",
        'font-size': this.isSpecialDevice ? '58px' : 'medium',
        'margin': '0px',
        'align-items': 'center',
      }
    },
    historyValueFullSize() {
      return {
        'font-size': this.isSpecialDevice ? '58px' : 'medium',
      }
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
@import "../shared/pointer.css";

.disable-history {
  opacity: 0.5;
}

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
  height: 100%;
}

.history-value {
  display: flex;
  justify-content: center;
  color: lightgray;
  position: absolute;
  margin-left: 2px;
}

.history-value-full {
  display: flex;
  justify-content: center;
  width: inherit;
  height: inherit;
  align-items: center;
  color: lightgray;
  position: absolute;
  margin: 0px !important;
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
  transition: height 0.3s linear, width 0.3s linear, top 0.3s linear,
    left 0.3s linear;
}

@media (pointer: fine) {
  .full-history-display {
    position: absolute;
    display: block;
    height: inherit;
    overflow-y: scroll;
    left: calc(2.5vw + 41px);
    width: calc(95vw - 41px);
  }

  .full-history-lenght {
    width: 41px;
    height: inherit;
    position: absolute;
    display: block;
  }

  .left-arrow {
    position: absolute;
    display: block;
    height: inherit;
    width: 2.5vw;
    background: url("../../assets/history/vector-left.png");
    background-repeat: no-repeat;
    background-size: 20%;
    background-position-x: 0.5vw;
    background-position-y: 50%;
    left: 41px;
  }

  .right-arrow {
    left: 97.5vw;
    position: absolute;
    display: block;
    height: inherit;
    width: 2.5vw;
    background: url("../../assets/history/vector-right.png");
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
    width: calc(97.5vw - 41px);
    left: 41px;
  }

  .full-history-lenght {
    width: 41px;
    height: inherit;
    position: absolute;
    display: block;
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
    width: 97.5vw;
    left: 2.5vw;
  }

  .full-history-lenght {
    width: 2.5vw;
    height: inherit;
    position: absolute;
    display: block;
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
