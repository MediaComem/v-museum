<template>
  <div
    class="title"
    @touchstart="touchStart"
    @touchend="changeSlide"
    @mousewheel="wheelMove"
  >
    <h1 class="justify-text">TAGS</h1>
    <arrow-up
      class="justify-arrow clickable"
      :isFull="isFullSize"
      :isMobile="isMobile"
      :text="arrowText"
      @previous-slide="$emit('previousSlide')"
    />
  </div>
  <div
    ref="tags"
    class="canvas-display overflow"
    @scroll="scrollMove"
    @touchend="changeSlideScroll"
    @mousewheel="wheelMoveScroll"
  >
    <div
      v-for="(tag, index) in tags.tags.sort((a, b) =>
        a.tag.localeCompare(b.tag)
      )"
      :key="index"
      :class="{ 'last-element': index == tags.tags.length - 1 }"
    >
      <div class="display-element clickable" @click="$emit('loadTagView', tag)">
        <p :class="fontSize">{{ tag.tag }} • {{ tag.totalImage }}</p>
      </div>
    </div>
  </div>
  <!-- It ensures the full display in any case -->
  <div style="padding-bottom: 2vh" />
</template>

<script>
import tags from '@/assets/onboarding/tags.json';
import ArrowUp from '../Logo/ArrowUp.vue';
export default {
  components: { ArrowUp },
  emits: ['previousSlide', 'loadTagView'],
  props: {
    isFullSize: Boolean,
    isMobile: Boolean,
    arrowText: Object,
  },
  data() {
    return {
      tags: tags,
      couldLoadNextSlide: true,
      startMoveTime: 0,
      startPosition: 0,
      shouldMove: undefined,
    };
  },
  methods: {
    wheelMove(event) {
      if (event.deltaY < 0) {
        clearTimeout(this.shouldMove);
        this.shouldMove = setTimeout(() => {
          this.$emit('previousSlide');
        }, 66);
      }
    },
    touchStart(event) {
      this.startMoveTime = Date.now();
      this.startPosition = event.changedTouches[0].clientY;
    },
    changeSlide(event) {
      if (Date.now() - this.startMoveTime > 100) {
        const endPosition = event.changedTouches[0].clientY;
        if (this.startPosition < endPosition) {
          this.$emit('previousSlide');
        }
      }
    },
    scrollMove() {
      if (this.$refs['tags'].scrollTop === 0) {
        this.couldLoadNextSlide = true;
      } else {
        this.couldLoadNextSlide = false;
      }
    },
    arrowMove(event) {
      if (this.couldLoadNextSlide && event.code === 'ArrowDown') {
        this.$emit('nextSlide');
      } else if (this.couldLoadNextSlide && event.code === 'ArrowUp') {
        this.$emit('previousSlide');
      }
    },
    wheelMoveScroll(event) {
      if (this.couldLoadNextSlide && event.deltaY < 0) {
        clearTimeout(this.shouldMove);
        this.shouldMove = setTimeout(() => {
          this.$emit('previousSlide');
        }, 66);
      }
    },
    changeSlideScroll() {
      if (this.couldLoadNextSlide) {
        clearTimeout(this.shouldMove);
        this.shouldMove = setTimeout(() => {
          this.$emit('previousSlide');
        }, 66);
      }
    },
  },
  computed: {
    fontSize() {
      return {
        'desktop-font': !this.isMobile,
        'mobile-font': this.isMobile,
      };
    },
  },
  activated() {
    window.addEventListener('keyup', this.arrowMove);
  },
  deactivated() {
    window.removeEventListener('keyup', this.arrowMove);
  },
};
</script>

<style scoped>
@import '../../shared/pointer.css';

.title {
  height: 10vh;
  width: 92vw;
  padding-left: 4vw;
  padding-right: 2vw;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.justify-arrow {
  width: 82vw;
  justify-content: flex-end;
}

.justify-text {
  width: 10vw;
  justify-content: flex-start;
}

.canvas-display {
  display: inline-flex;
  flex-wrap: wrap;
  width: 92vw;
  height: 90vh;
  padding-left: 4vw;
  padding-right: 2vw;
  justify-content: left;
  align-items: center;
}

@media only screen and (min-width: 300px) and (max-width: 436px) {
  .display-element {
    width: 48vw;
    display: flex;
    justify-content: left;
    align-items: center;
  }

  .last-element {
    flex: 1 1 48vw;
  }
}

@media only screen and (min-width: 437px) and (max-width: 999px) {
  .display-element {
    width: 32vw;
    display: flex;
    justify-content: left;
    align-items: center;
  }
  .last-element {
    flex: 1 1 32vw;
  }
}

@media only screen and (min-width: 800px) {
  .display-element {
    width: 23vw;
    display: flex;
    justify-content: left;
    align-items: center;
  }

  .last-element {
    flex: 1 1 23vw;
  }
}

@media only screen and (max-width: 800px) {
  .last-element {
    max-width: 32vw;
  }
}

@media only screen and (max-width: 437px) {
  .last-element {
    max-width: unset;
    flex: unset;
  }
}

.desktop-font {
  font-size: normal;
}

.mobile-font {
  font-size: x-small;
}

.canvas-display > * {
  border-top: solid 1px black;
}
</style>
