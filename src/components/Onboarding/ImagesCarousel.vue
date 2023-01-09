<template>
  <div v-if="showCarousel" class="images-preview-carousel">
    <div class="tag-remover"
      @mouseover="displayTagArrow = true"
      @mouseleave="displayTagArrow = false">
      <div class="tag-carousel-layout">
        <div class="left-arrow">
          <svg
            v-if="displayTagArrow"
            class="button-svg"
            @click="showPreviousTags()"
            @mouseover="tagArrowLeftColor = '#616161'"
            @mouseleave="tagArrowLeftColor = '#FFFFFF'"
            width="15"
            height="25"
            viewBox="0 0 15 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              class="previous-arrow"
              d="M12.2499 -1.90735e-06L14.3999 2.15L4.4999 12.05L14.3999 21.95L12.2499 24.1L0.199903 12.05L12.2499 -1.90735e-06Z"
              :fill="tagArrowLeftColor"
            />
          </svg>
        </div>
        <div class="images-layout" ref="tags">
          <div v-for="(tag, index) in selected_tags" :key="index">
            <div v-if="tag.length > 0" class="tag-remove-layout">
              <img
                src="@/assets/onboarding/cross_white.svg"
                alt="cross"
                @click="removeTag(index)"
              />
              <p>{{ tag }}</p>
            </div>
          </div>
        </div>
        <div class="right-arrow">
          <svg
            v-if="displayTagArrow"
            class="button-svg"
            @click="showNextTags()"
            @mouseover="tagArrowRighttColor = '#616161'"
            @mouseleave="tagArrowRighttColor = '#FFFFFF'"
            width="15"
            height="25"
            viewBox="0 0 15 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              class="next-arrow"
              d="M2.7501 25L0.600098 22.85L10.5001 12.95L0.600098 3.05L2.7501 0.900002L14.8001 12.95L2.7501 25Z"
              :fill="tagArrowRighttColor"
            />
          </svg>
        </div>
      </div>
    </div>
    <div
      class="images-arrows-wrapper"
      @mouseover="displayArrow = true"
      @mouseleave="displayArrow = false"
    >
      <div class="carousel-layout">
        <div class="left-arrow">
          <!-- previous image arrow-->
          <svg
            v-if="displayArrow"
            class="button-svg"
            @click="showPreviousImage()"
            @mouseover="arrowLeftColor = '#616161'"
            @mouseleave="arrowLeftColor = '#FFFFFF'"
            width="15"
            height="25"
            viewBox="0 0 15 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              class="previous-arrow"
              d="M12.2499 -1.90735e-06L14.3999 2.15L4.4999 12.05L14.3999 21.95L12.2499 24.1L0.199903 12.05L12.2499 -1.90735e-06Z"
              :fill="arrowLeftColor"
            />
          </svg>
        </div>

        <!-- Images -->
        <div class="images-layout" ref="carousel">
          <div
            class="image-wrapper"
            v-for="index in this.images_index_to_display"
            :key="index"
          >
            <img
              class="image-carousel-size"
              :src="images[index].url"
              @click="loadImage(images[index].id)"
            />
          </div>
        </div>

        <!-- next image arrow-->
        <div class="right-arrow">
          <svg
            v-if="displayArrow"
            class="button-svg"
            @click="showNextImage()"
            @mouseover="arrowRighttColor = '#616161'"
            @mouseleave="arrowRighttColor = '#FFFFFF'"
            width="15"
            height="25"
            viewBox="0 0 15 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              class="next-arrow"
              d="M2.7501 25L0.600098 22.85L10.5001 12.95L0.600098 3.05L2.7501 0.900002L14.8001 12.95L2.7501 25Z"
              :fill="arrowRighttColor"
            />
          </svg>
        </div>
      </div>
    </div>
    <div class="docs">
      <span :class="fontSize" class="nb-docs" v-if="images.length > 1"
        >{{ images.length }} documents</span
      >
      <span v-else :class="fontSize" class="nb-docs" style="cursor: pointer"
        >{{ images.length }} document</span
      >
    </div>
    <div class="buttons">
      <span
        :classe="fontSize"
        class="nb-docs fullscreen"
        @click="$emit('showFullTagPage')"
        >Voir tous ></span
      >
    </div>
  </div>
  <div v-else class="no-image-information">
    <p class="documents">{{ nbImages }} documents</p>
    <p class="info">Select a tag</p>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';

import dataFetch from '../../api/dataFetching';

export default {
  props: {
    nbImages: Number,
    isMobile: Boolean,
    showCarousel: Boolean,
  },
  emits: ['showFullTagPage'],
  data() {
    return {
      images_index_to_display: Array.from(Array(this.nbImages).keys()),
      position: 0,
      arrowLeftColor: '#ffffff',
      arrowRighttColor: '#ffffff',
      tagArrowLeftColor: '#ffffff',
      tagArrowRighttColor: '#ffffff',
      moveInterval: undefined,
      displayArrow: false,
      displayTagArrow: false,
    };
  },
  methods: {
    showPreviousImage() {
      this.$refs.carousel.scrollLeft =
        this.$refs.carousel.scrollLeft - (window.innerWidth - 300);
    },
    showNextImage() {
      this.$refs.carousel.scrollLeft =
        this.$refs.carousel.scrollLeft + (window.innerWidth - 300);
    },
    showPreviousTags() {
      this.$refs.tags.scrollLeft =
        this.$refs.tags.scrollLeft - (window.innerWidth - 300);
    },
    showNextTags() {
      this.$refs.tags.scrollLeft =
        this.$refs.tags.scrollLeft + (window.innerWidth - 300);
    },
    //Create array representing number of images to display
    loadImage(imageId) {
      dataFetch.getImageById(imageId).then((data) => {
        if (data.length > 0) {
          const img_data = data[0];
          this.$router.push({
            path: `/image/${imageId}`,
            query: { image: JSON.stringify(img_data) },
          });
        }
      });
    },
    removeTag(index) {
      this.$store.dispatch('removeTag', index);
    },
  },
  computed: {
    fontSize() {
      return {
        'desktop-font': !this.isMobile,
        'mobile-font': this.isMobile,
      };
    },
    ...mapGetters({
      images: 'getImages',
      selected_tags: 'getTags',
    }),
  },
  mounted() {
    this.$store.dispatch('setFullTagPageOrigin', 'tags_slide');
  },
};
</script>

<style scoped>
.desktop-font {
  font-size: normal;
}

.mobile-font {
  font-size: small;
}

.images-preview-carousel {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(3, 1fr);
  grid-column-gap: 0px;
  grid-row-gap: 0px;
  position: relative;
  background-color: black;
  height: 35vh;
  width: 100vw;
  z-index: 1;
}

.tag-remover {
  grid-area: 1 / 1 / 2 / 3;
  display: flex;
  border-bottom: 1px solid #808080;
  overflow-x: auto;
  height: 50px;
}

.tag-remove-layout {
  color: white;
  border: 1px solid white;
  border-radius: 6px;
  margin-right: 20px;
  display: flex;
  margin-top: 10px;
  margin-bottom: 10px;
  width: max-content;
}

.tag-remove-layout:hover {
  color: #808080;
  border-color: #808080;
}

.tag-remove-layout > img {
  margin-left: 5px;
  margin-right: 5px;
  cursor: pointer;
}

.tag-remove-layout > p {
  margin-right: 5px;
  margin-top: 5px;
  margin-bottom: 5px;
}

.docs {
  grid-area: 3 / 1 / 4 / 2;
  padding-left: 10px;
}

.buttons {
  grid-area: 3 / 2 / 4 / 3;
  display: flex;
  justify-content: flex-end;
  padding-right: 10px;
}

.button-svg {
  cursor: pointer;
}

.images-arrows-wrapper {
  grid-area: 2 / 1 / 3 / 3;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: calc(35vh - 70px);
}

.carousel-layout {
  display: grid;
  grid-template-columns: 30px calc(100vw - 60px) 30px;
  grid-template-rows: 20vh;
  grid-column-gap: 0px;
  grid-row-gap: 0px;
}

.tag-carousel-layout {
  display: grid;
  grid-template-columns: 30px calc(100vw - 60px) 30px;
  grid-template-rows: 50px;
  grid-column-gap: 0px;
  grid-row-gap: 0px;
}

.image-wrapper {
  height: 100%;
  display: flex;
  align-items: center;
}

.left-arrow {
  grid-area: 1 / 1 / 2 / 2;
  display: flex;
  justify-content: center;
  align-items: center;
}

.right-arrow {
  grid-area: 1 / 3 / 2 / 4;
  display: flex;
  justify-content: center;
  align-items: center;
}

.images-layout {
  grid-area: 1 / 2 / 2 / 3;
  overflow-x: auto;
  display: flex;
}

.image-carousel-size {
  cursor: pointer;
  margin: 0 2.83vw 0 3.83vh;
  height: 100%;
  position: relative;
}

.full-screen-button {
  clear: none;
}

.nb-docs {
  color: white;
}

.no-image-information {
  height: 80px;
  width: 100vw;
  background-color: black;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 80px;
  grid-column-gap: 0px;
  grid-row-gap: 0px;
}

.no-image-information > .documents {
  grid-area: 1 / 1 / 2 / 2;
  color: white;
  display: flex;
  align-items: center;
  padding-left: 10px;
}

.no-image-information > .info {
  grid-area: 1 / 2 / 2 / 3;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  color: #808080;
  padding-right: 10px;
}

.fullscreen {
  cursor: pointer;
}

.fullscreen:hover {
  color: #808080;
}
</style>
