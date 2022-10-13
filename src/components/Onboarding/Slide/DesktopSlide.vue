<template>
  <img
    class="image-display"
    :src="`/v-museum/onboarding/${item.imagePath}`"
  />
  <div
    class="collapse-transition"
    :style="collapse"
    style="position: absolute; left: 0px; top: 0px; height: 100vh; overflow-y:scroll"
  >
    <p class="collection-text collapse-text-align overflow">{{ item.text }}</p>
  </div>
  <logo
    style="position: absolute; left: 2vw; top: 2vh; z-index: 1;"
  />
  <arrow-up
    :isFull="isFullSize"
    :isMobile="false"
    class="arrow-up"
    :text="index === 0 ? mainTitle : information.collection[index - 1]"
    @click="changeSlide('UP')"
  />
  <div
    class="collection-position"
  >
    <el-row>
      <h2
        :class="
          isFullSize ? 'collection-title' : 'collection-title-intermediary'
        "
      >
        {{ item.title }}
      </h2>
    </el-row>
    <el-row>
      <p
        :class="isFullSize ? 'collection-text' : 'collection-text-intermediary'"
      >
        {{ item.text.slice(0, 180) }}
        <a class="more-link clickable" @click="isCollapse = !isCollapse"
          >MORE</a
        >
      </p>
    </el-row>
    <el-row style="height: 69px; width: 37vw">
      <documents-information
        class="completion-element clickable"
        :tagInfos="item.tag"
        @load-tag-view="$emit('loadTagView', item.tag)"
      />
    </el-row>
  </div>
  <arrow-down
    class="arrow-down"
    :isMobile="false"
    :isFull="isFullSize"
    :text="
      index === information.collection.length - 1
        ? allTagText
        : information.collection[index + 1]
    "
    @click="changeSlide('DOWN')"
  />
</template>

<script>
import Logo from '../../shared/components/Logo.vue';
import ArrowUp from '../Logo/ArrowUp.vue';
import ArrowDown from '../Logo/ArrowDown.vue';
import DocumentsInformation from '../Logo/DocumentsInformation.vue';

export default {
  components: { Logo, ArrowUp, ArrowDown, DocumentsInformation },
  emits: ['loadTagView', 'changeSlide'],
  props: {
    index: Number,
    item: Object,
    isFullSize: Boolean,
    mainTitle: Object,
    allTagText: Object,
    information: Object,
  },
  data() {
    return {
      isCollapse: false,
    };
  },
  methods: {
    changeSlide(event) {
      if (event === 'UP') {
        if (this.index === 0) {
          this.$emit('changeSlide', 'Introduction')
        }
        else {
          this.$emit('changeSlide', `decade-${this.index - 1}`)
        }
      }
      else {
        if (this.index === this.information.collection.length - 1) {
          this.$emit('changeSlide', 'Tags')
        }
        else {
          this.$emit('changeSlide', `decade-${this.index + 1}`)
        }
      }
    }
  },
  computed: {
    collapse() {
      return {
        'background-color': this.information.collection[this.index].color,
        height: '100vh',
        width: '57vw',
        'z-index': 1,
        transform: this.isCollapse ? 'translateX(0)' : 'translate(-57vw)',
      };
    },
  },
};
</script>

<style scoped>
@import '../onboarding.css';
@import './desktop_slide.css';
@import '../../shared/pointer.css';
</style>
