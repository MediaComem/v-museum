<template>
  <div v-if="searchView" class="overlay" @click="searchView = false"></div>
  <div style="height: 100vh;">
    <div class="title">
      <div class="tag-header-back">
        <img class="clickable" src="@/assets/shared/Vector.svg" @click="backButton()"/>
      </div>
      <div class="tags-title">
        <h1 v-if="show_form">TAGS</h1>
        <h1 v-if="show_full_tag_page">
          <span v-for="(tag, index) in selected_tags" :key="index">
            <span v-if="index > 0">{{ tag.toUpperCase() }}</span>
            <span v-if="index < selected_tags.length - 1 && index > 0">
              &
            </span>
          </span>
        </h1>
      </div>
      <div v-if="!show_full_tag_page" class="tag-header-search">
        <img class="clickable" style="margin-right: 15px" src="@/assets/onboarding/search.svg" @click="searchView = true" />
        <MenuIcon @click="openMenu()"/>
      </div>
    </div>
    <div v-if="show_form">
      <div v-if="getImageBannerPosition">
        <images-carousel
          @showFullTagPage="showFullScreenCarousel()"
          :is-mobile="isMobile"
          :nbImages="images_bis.length"
          :show-carousel="show_carousel"
          :key="carousel_key"
        />
        <tags-combinaisons-form
          @updateTagsList="updateTagsList"
          :is-mobile="isMobile"
          :show-carousel="show_carousel"
        />
      </div>
      <div v-else>
        <tags-combinaisons-form
          @updateTagsList="updateTagsList"
          :is-mobile="isMobile"
          :show-carousel="show_carousel"
        />
        <images-carousel
          @showFullTagPage="showFullScreenCarousel()"
          :is-mobile="isMobile"
          :nbImages="images_bis.length"
          :show-carousel="show_carousel"
          :key="carousel_key"
        />
      </div>
    </div>
    <full-tag-page v-if="show_full_tag_page"/>
  </div>
  <search-tag
    @close="searchView = false"
    :is-mobile="isMobile"
    :is-display="searchView"
  />
  <Menu :open="isOpenMenu" @close="isOpenMenu = false" @change-slide="openHome($event)"/>
</template>

<script>
import { useWindowSize } from 'vue-window-size';
import { mapGetters } from 'vuex';

import tags from '@/assets/onboarding/tags.json';
import images from '@/assets/data/images.json';

import ImagesCarousel from './ImagesCarousel.vue';
import TagsCombinaisonsForm from '../FullTags/TagCombinaisonsForm.vue';
import SearchTag from './SearchTag.vue';
import FullTagPage from '../FullTags/FullTagPage.vue';
import MenuIcon from '../shared/components/MenuIcon.vue';
import Menu from '../shared/components/Menu.vue';

export default {
  components: { ImagesCarousel, TagsCombinaisonsForm, FullTagPage, SearchTag, MenuIcon, Menu },
  emits: ['changeSlide', 'loadTagView'],
  props: {
    isFullSize: Boolean,
    isMobile: Boolean,
    arrowText: Object,
  },
  data() {
    return {
      tags: tags,
      show_form: true,
      show_full_tag_page: false,
      images,
      carousel_key: 0,
      show_carousel: false,
      images_for_carousel: images,
      searchView: false,
      isOpenMenu: false,
      windowWidth: 0,
    };
  },
  methods: {
    openMenu() {
      this.isOpenMenu = true;
    },
    openHome(event) {
      this.$router.push({
        path: `/`,
        query: { ref: event },
      });
    },
    backButton() {
      if (this.show_full_tag_page) this.exitFullScreen();
      else this.$router.push({path: `/`});
    },
    updateTagsList(data) {
      //rebuild the component to prevent array length problems
      this.carousel_key = data.length;
      if (this.images_bis.length > 0) {
        this.show_carousel = this.selected_tags.length > 1;
        this.images_for_carousel = data.images;
      }
    },
    showFullScreenCarousel() {
      this.show_form = false;
      this.show_full_tag_page = true;
    },
    exitFullScreen() {
      this.show_form = true;
      this.show_carousel = true;
      this.show_full_tag_page = false;
    },
  },
  computed: {
    fontSize() {
      return {
        'desktop-font': !this.isMobile,
        'mobile-font': this.isMobile,
      };
    },
    padding() {
      return {
        'padding-bottom': this.isSafariIphone ? '180px' : '15vh',
      };
    },
    getImageBannerPosition() {
      return this.windowWidth < 750;
    },
    ...mapGetters({
      images_bis: 'getImages',
      selected_tags: 'getTags',
    }),
  },
  mounted() {
    const { width } = useWindowSize();
    this.windowWidth = width;
  }
};
</script>

<style scoped>
@import '../shared/pointer.css';

.overlay {
  background-color: black;
  opacity: 0.2;
  z-index: 2;
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
}

.title {
  display: grid;
  grid-template-columns:  33% 33% 32%;;
  grid-template-rows: 10vh;
  grid-column-gap: 0px;
  grid-row-gap: 0px;
}

.tags-title {
  grid-area: 1 / 2 / 2 / 3;
  display: flex;
  justify-content: center;
  align-items: center;
}

.justify-arrow {
  width: 82vw;
  justify-content: flex-end;
}

.justify-text {
  width: 10vw;
  justify-content: flex-start;
}

@media only screen and (min-width: 300px) and (max-width: 436px) {
  .display-element {
    width: 42vw;
    height: 50px;
    display: flex;
    justify-content: left;
    align-items: center;
  }
}

@media only screen and (min-width: 437px) and (max-width: 999px) {
  .display-element {
    width: 32vw;
    display: flex;
    justify-content: left;
    align-items: center;
  }
}

@media only screen and (min-width: 800px) {
  .display-element {
    width: 23vw;
    display: flex;
    justify-content: left;
    align-items: center;
  }

}

.desktop-font {
  font-size: normal;
}

.mobile-font {
  font-size: small;
}

.tag-header-back {
  grid-area: 1 / 1 / 2 / 2;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-left: 2%;
}

.tag-header-search {
  grid-area: 1 / 3 / 2 / 4;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.tag-header-search > img {
  cursor: pointer;
}
</style>
