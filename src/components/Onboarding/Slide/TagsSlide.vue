<template>
  <div class="title" @touchstart="touchStart" @touchend="changeSlide" @mousewheel="wheelMove">
    <h1 class="justify-text tags-title">SREARCH WITH TAGS</h1>
    <arrow-up class="justify-arrow clickable" :isFull="isFullSize" :isMobile="isMobile" :text="arrowText"
      @previous-slide="$emit('previousSlide')" />
  </div>
  <div class="filters-management">
    <tags-combinaisons-form @updateTagsList="updateTagsList" :isMobile="isMobile"/>
  </div>
  <!-- <div ref="tags_to_display" class="canvas-display overflow tags-list" @scroll="scrollMove" @touchend="changeSlideScroll"
    @mousewheel="wheelMoveScroll">
    <div v-for="(tag, index) in this.tags_to_display" :key="index" class="border">
      <div class="display-element clickable" @click="$emit('loadTagView', tag)">
        <p :class="fontSize" @mouseover="this.show_carousel = true">{{ tag.tag }} • {{ tag.nb_images }}</p>
      </div>
    </div>
  </div> -->
  <images-carousel v-if="show_carousel" @showFullTagPage="$emit('loadTagView', this.tags.tags[0])" :images="this.images_for_carousel"
    :isMobile="isMobile" />
  <!-- It ensures the full display in any case -->
  <div style="padding-bottom: 2vh" />
</template>

<script>
import { ref } from 'vue'
import tags from "@/assets/onboarding/tags.json";
import images from '@/assets/data/images.json';
import ArrowUp from "../Logo/ArrowUp.vue";
import ImagesCarousel from "../../FullImage/ImagesCarousel.vue";
import TagsCombinaisonsForm from "../../FullTags/TagsCombinaisonsForm.vue";

export default {
  components: { ArrowUp, ImagesCarousel, TagsCombinaisonsForm },
  emits: ["previousSlide", "loadTagView", "showFullTagPage", "updateTagsList"],
  props: {
    isFullSize: Boolean,
    isMobile: Boolean,
    arrowText: Object,
  },
  data() {
    return {
      tags: tags,
      tags_to_display: ref(tags.tags),
      images: images,
      images_for_carousel: ref(images),
      selected_tags: [''],
      show_carousel: false,
      show_full_tag_page: false,
      couldLoadNextSlide: true,
      changeSlideInProgress: false,
      delayBeforeAction: 0,
      startMoveTime: 0,
      startPosition: 0,
    };
  },
  methods: {
    wheelMove(event) {
      if (event.deltaY < 0 && !this.changeSlideInProgress) {
        this.changeSlideInProgress = true;
        this.$emit("previousSlide");
        // This timeout is used to ensure that only one action is take into account when long wheel has been used.
        setTimeout(() => (this.changeSlideInProgress = false), 2000);
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
          this.$emit("previousSlide");
        }
      }
    },
    scrollMove() {
      if (this.$refs["tags_to_display"].scrollTop === 0) {
        this.couldLoadNextSlide = true;
        this.changeSlideInProgress = false;
        this.delayBeforeAction = Date.now();
      } else {
        this.couldLoadNextSlide = false;
      }
    },
    wheelMoveScroll(event) {
      const diffTime = Date.now() - this.delayBeforeAction;
      if (
        this.couldLoadNextSlide &&
        event.deltaY < 0 &&
        diffTime > 1000 &&
        !this.changeSlideInProgress
      ) {
        this.changeSlideInProgress = true;
        this.$emit("previousSlide");
        // This timeout is used to ensure that only one action is take into account when long wheel has been used.
        setTimeout(() => (this.changeSlideInProgress = false), 2000);
      }
    },
    changeSlideScroll() {
      const diffTime = Date.now() - this.delayBeforeAction;
      if (this.couldLoadNextSlide && diffTime > 1000) {
        this.$emit("previousSlide");
      }
    },
    updateTagsList(data) {
      console.log("to update: ", data)
      this.tags_to_display = data.tags_list
      this.images_for_carousel = data.images
      this.selected_tags = data.selected_tags
    },
    toggleCarouselDisplay() {
      this.show_carousel = false;
      this.show_full_tag_page = true;
      console.log("on change")
    }
  },

  computed: {
    fontSize() {
      return {
        "desktop-font": !this.isMobile,
        "mobile-font": this.isMobile,
      };
    },
    imagesWithTag() {
      const images_with_tag = this.images.filter((img) => img.tags.includes(this.currentTag))
      return images_with_tag
    },
    imagesForTags() {
      const tag_combinaison = [this.currentTag, this.additional_tag]
      const images_with_tags = this.getCorrespondingImages([this.currentTag, this.additional_tag])
      const json_combi = {
        "tags": tag_combinaison,
        "images": images_with_tags,
        "nb_images": images_with_tags.length,
      }
      return json_combi
    }
  },
};

</script>

<style scoped>
@import "../../shared/pointer.css";

.title {
  height: 10vh;
  width: 96vw;
  padding-left: 2vw;
  padding-right: 2vw;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.tags-title {
  width: 41.5vw;
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
  width: 96vw;
  height: 90vh;
  padding-left: 2vw;
  padding-right: 2vw;
  justify-content: center;
  align-items: center;
}

@media only screen and (min-width: 300px) and (max-width: 436px) {
  .display-element {
    width: 48vw;
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
  font-size: x-small;
}




.tags-list {
  height: 51vh;
  border-left: solid 1px black;
  border-top: solid 1px black;
}

.border {
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: solid 1px black;
  border-right: solid 1px black;
  height: 70px;
}



.filters-management {
  height: 12.52vh;
}
</style>
