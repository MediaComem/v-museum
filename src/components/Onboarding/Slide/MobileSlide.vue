<template>
  <div
    class="collapse-transition"
    :style="collapseMobile"
    style="position: absolute; left: 0px; top: 0px; z-index:1;"
  >
    <el-row :align="'middle'">
      <el-col :span="21">
        <h2 class="collection-title-mobile mobile-margin">
          {{ item.title }}
        </h2>
      </el-col>
      <el-col :span="3">
        <img
          src="@/assets/shared/cross.svg"
          @click="isCollapse = !isCollapse"
        />
      </el-col>
    </el-row>
    <el-row>
      <div style="height: calc(85vh - 80px); overflow: scroll">
        <p class="collection-text-mobile collapse-text-align-mobile">
          {{ item.text }}
        </p>
      </div>
    </el-row>
  </div>
  <div>
    <el-row>
      <img
        class="image-display-mobile"
        :src="`/v-museum/onboarding/${item.imagePath}`"
      />
    </el-row>
    <div class="menu-item">
      <MenuIcon @click="openMenu()"/>
    </div>
    <el-row>
      <h2 class="collection-title-mobile mobile-margin">
        {{ item.title }}
      </h2>
    </el-row>
    <el-row class="completion-element-mobile mobile-margin">
      <documents-information
        class="completion-element clickable"
        :tagInfos="item.tag"
        @load-tag-view="$emit('loadTagView', item.tag)"
      />
    </el-row>
    <el-row>
      <p class="collection-text-mobile mobile-margin">
        {{ item.text.slice(0, 180) }}
        <a class="more-link" @click="isCollapse = !isCollapse">MORE</a>
      </p>
    </el-row>
  </div>
  <Menu :open="isOpenMenu" @close="isOpenMenu = false" @change-slide="$emit('changeSlide', $event)"/>
</template>

<script>
import DocumentsInformation from "../Logo/DocumentsInformation.vue";
import MenuIcon from '../../shared/components/MenuIcon.vue';
import Menu from '../../shared/components/Menu.vue';

export default {
  components: { DocumentsInformation, MenuIcon, Menu },
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
    collapseMobile() {
      return {
        "background-color": this.information.collection[this.index].color,
        width: "100vw",
        transform: this.isCollapse ? "translateX(0)" : "translate(-100vw)",
      };
    },
  },
};
</script>

<style scoped>
@import "../onboarding.css";
@import "./mobile_slide.css";
@import "../../shared/pointer.css";
</style>
