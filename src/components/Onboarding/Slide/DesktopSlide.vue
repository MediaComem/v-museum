<template>
  <img
    class="image-display"
    :src="`/v-museum/onboarding/${item.imagePath}`"
  />
  <div
    class="collapse-transition"
    :style="collapse"
    style="position: absolute; left: 0px; top: 0px; height: calc(100vh - 40px); overflow-y:scroll; z-index: 100; margin: 20px; background-color: white;"
  >
    <img class="close-collapse-cross clickable" src="@/assets/shared/cross.svg" alt="cross" @click="isCollapse = !isCollapse">
    <div class="collapse-text-container overflow">
      <p class="collapse-text-align">{{ item.text }}</p>
    </div>
  </div>
  <logo
    style="position: absolute; left: 2vw; top: 2vh; z-index: 1;"
  />
  <div class="menu-item">
    <MenuIcon @click="openMenu()"/>
  </div>
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
  <Menu :open="isOpenMenu" @close="isOpenMenu = false" @change-slide="$emit('changeSlide', $event)"/>
</template>

<script>
import Logo from '../../shared/components/Logo.vue';
import MenuIcon from '../../shared/components/MenuIcon.vue';
import DocumentsInformation from '../Logo/DocumentsInformation.vue';
import Menu from '../../shared/components/Menu.vue';

export default {
  components: { Logo, DocumentsInformation, MenuIcon, Menu },
  emits: ['loadTagView', 'changeSlide'],
  props: {
    index: Number,
    item: Object,
    isFullSize: Boolean,
    mainTitle: Object,
    information: Object,
  },
  data() {
    return {
      isCollapse: false,
      isOpenMenu: false,
    };
  },
  methods: {
    openMenu() {
      this.isOpenMenu = true;
    }
  },
  computed: {
    collapse() {
      return {
        'background-color': this.information.collection[this.index].color,
        height: '100vh',
        width: 'calc(57vw - 40px)',
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
