<template>
  <div style="height: 100vh;">
    <div
      class="title"
    >
      <div class="tags-title">
      <h1 v-if="show_form" class="tags-h1">SEARCH WITH TAGS</h1>
      <h1 v-if="show_full_tag_page" class="tags-h1">
        <span v-for="(tag, index) in selected_tags" :key="index">
          <span v-if="index > 0">{{ tag.toUpperCase() }}</span>
          <span v-if="index < selected_tags.length - 1 && index > 0"> & </span>
        </span>
      </h1>
    </div>
      <arrow-up
        class="justify-arrow clickable"
        :isFull="isFullSize"
        :isMobile="isMobile"
        :text="arrowText"
        @click="$emit('changeSlide', `decade-${lastId}`)"
      />
    </div>
    <div v-if="show_form">
      <tags-combinaisons-form @updateTagsList="updateTagsList" :isMobile="isMobile" />
      <images-carousel v-if="show_carousel" @showFullTagPage="showFullScreenCarousel()" :isMobile="isMobile"
        :nbImages="images_bis.length" :key="carousel_key" />
    </div>
    <full-tag-page v-if="show_full_tag_page" @exitFullScreen="exitFullScreen()" />
    <!-- It ensures the full display in any case -->
    <!--div :style="padding" /-->
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import tags from '@/assets/onboarding/tags.json';
import images from '@/assets/data/images.json';
import ArrowUp from '../Logo/ArrowUp.vue';

import ImagesCarousel from "../ImagesCarousel.vue";
import TagsCombinaisonsForm from "../../FullTags/TagCombinaisonsForm.vue";
import FullTagPage from '../../FullTags/FullTagPage.vue';

export default {
  components: { ArrowUp, ImagesCarousel, TagsCombinaisonsForm, FullTagPage },
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
      show_form: true,
      show_full_tag_page: false,
      images,
      carousel_key: 0,
      show_carousel: false,
      images_for_carousel: images,
    };
  },
  methods: {
    updateTagsList(data) {
      //rebuild the component to prevent array length problems
      this.carousel_key = data.length
      if (this.images_bis.length > 0) {
        this.show_carousel = true
        this.images_for_carousel = data.images
      }
      this.handleClickableTagsDivSize()
    },
    showFullScreenCarousel() {
      this.show_form = false;
      this.show_full_tag_page = true;
    },
    exitFullScreen() {
      this.show_form = true
      this.show_carousel = true
      this.show_full_tag_page = false
      // //Resize the clickable tags div to let the carousel appear
      setTimeout(() => {
        this.handleClickableTagsDivSize()
      })
    },
    handleClickableTagsDivSize() {
      if (this.selected_tags.length > 1) {
        document.querySelector('.clickable-tags-list').classList.add('with-carousel')
      } else {
        document.querySelector('.clickable-tags-list').classList.remove('with-carousel')
      }
    }
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
      }
    },
    ...mapGetters({
      images_bis: "getImages",
      selected_tags: "getTags"
    }),
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

.tags-title {
  width: 450px;
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
    height: 50px;
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

.tags-h1 {
  width: 70vw;
}
</style>
