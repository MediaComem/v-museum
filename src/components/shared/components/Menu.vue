<template>
  <div class="menu-layout menu-transition" :style="openMenu">
    <div class="menu-header">
      <MenuCloseIcon @click="$emit('close')" />
    </div>
    <div class="menu-content">
      <div><p class="text clickable" @click="changeSlide('Introduction')">Introduction</p></div>
      <Accordeon
        :header="'Collection'"
        :length="information.collection.length"
        :should-be-open="true"
      >
        <div v-for="(item, index) in information.collection" :key="index">
          <p class="text text-margin clickable" @click="changeSlide(`decade-${index}`)">{{ item.title }}</p>
        </div>
      </Accordeon>
      <div>
        <div><p class="text clickable" @click="load('/search')">Search</p></div>
      </div>
      <div class="last-element">
        <div><p class="text clickable" @click="load('/search')">About</p></div>
      </div>
    </div>
  </div>
</template>

<script>
import text from '@/assets/onboarding/text.json';
import MenuCloseIcon from './MenuCloseIcon.vue';
import Accordeon from './Accordeon.vue';

export default {
  props: {
    open: Boolean,
  },
  emits: ['close', 'changeSlide'],
  components: { MenuCloseIcon, Accordeon },
  data() {
    return {
      information: text,
    };
  },
  methods: {
    changeSlide(slide) {
      this.$emit('close');
      this.$emit('changeSlide', slide)
    },
    load(path) {
      this.$emit('close');
      this.$router.push({path: path});
    }
  },
  computed: {
    openMenu() {
      return {
        transform: this.open ? 'translateX(0)' : 'translate(-100vw)',
      };
    },
  },
};
</script>

<style scoped>
@import './menu.css';
@import '../pointer.css';
</style>
