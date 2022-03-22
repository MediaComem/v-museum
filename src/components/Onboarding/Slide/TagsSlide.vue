<template>
<div class="pppp">
<div
    class="title"
  >
    <h1 class="justify-text">TAGS</h1>
    <arrow-up
      class="justify-arrow clickable"
      :isFull="isFullSize"
      :isMobile="isMobile"
      :text="arrowText"
      @click="$emit('changeSlide', `decade-${lastId}`)"
    />
  </div>
  <div
    ref="tags"
    class="canvas-display overflow"
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
    <!-- It ensures the full display in any case -->
    <div style="height: 10vh" />
  </div>
</div>
</template>

<script>
import tags from '@/assets/onboarding/tags.json';
import ArrowUp from '../Logo/ArrowUp.vue';
export default {
  components: { ArrowUp },
  emits: ['changeSlide', 'loadTagView'],
  props: {
    isFullSize: Boolean,
    isMobile: Boolean,
    arrowText: Object,
    lastId: Number,
  },
  data() {
    return {
      tags: tags,
    };
  },
  computed: {
    fontSize() {
      return {
        'desktop-font': !this.isMobile,
        'mobile-font': this.isMobile,
      };
    },
  },
};
</script>

<style scoped>
@import '../../shared/pointer.css';

.pppp {
  height: -webkit-fill-available;
}

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
  height: -webkit-fill-available;
  padding-left: 4vw;
  padding-right: 2vw;
  justify-content: left;
  align-items: center;
  padding-bottom: 15vh;
}

@media only screen and (min-width: 300px) and (max-width: 436px) {
  .display-element {
    width: 42vw;
    display: flex;
    justify-content: left;
    align-items: center;
  }

  .last-element {
    flex: 1 1 42vw;
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
  font-size: small;
}

.canvas-display > * {
  border-top: solid 1px black;
}
</style>
