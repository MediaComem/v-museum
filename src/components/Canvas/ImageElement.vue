<template>
  <div>
    <div v-if="getVisibility" :style="getIndicator" @click="$emit('indicatorMove', {left: imagePosition.left, top: imagePosition.top})">
      <Indicator :tag="tag"/>
    </div>
    <div :style="position" v-if="imageData" class="block-selection">
      <p
        :ref="'tag'"
        class="related-text text_left"
        :class="imageAppearAnimation"
        :style="textWidth"
      >
        {{ tag }}
      </p>
      <img
        :ref="'image'"
        draggable="false"
        style="object-fit: cover"
        class="clickable"
        :class="imageAppearAnimation"
        :style="imageHover"
        :src="imageData.imagePaths.large"
        :height="imageHeight"
        :width="imageWidth"
        @mousedown="clickDuration = Date.now()"
        @mouseup="loadFullImageView()"
      />
      <div v-if="focus" :style="textWidth">
        <div class="text_left">
          <p class="font-size-information">
            Illustration: &nbsp;
          </p>
          <p class="font-size-information-text">
            {{ imageData.author }}
          </p>
        </div>
        <div class="text_left">
          <p class="font-size-information margin-story">
            Story: &nbsp;
          </p>
          <p class="font-size-information-text margin-story">
            {{ imageData.title }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dataFetch from '../../api/dataFetching';
import {
  thumbnailWidth,
  relatedThumbnailWidth,
  getImageWidth,
  getImageHeight,
} from './service/image_management_service';

import Indicator from './Indicator.vue';

export default {
  watch: {
    imageId: function(newVal) {
      clearTimeout(this.timeoutEvent);
      this.shouldRunAnimation = true;
      this.imageData = undefined;
      dataFetch.getImageById(newVal).then((data) => {
        if (data.length > 0) {
          this.imageData = data[0];
          this.timeoutEvent = setTimeout(
            () => (this.shouldRunAnimation = false),
            3000
          );
          this.$nextTick(() => {
            this.$emit('dataLoaded');
            this.$emit('isInScreen');
          });
        }
      });
    },
  },
  components: { Indicator },
  props: {
    imagePosition: Object,
    focus: Boolean,
    wasSelected: Boolean,
    runDisapearAnimation: Boolean,
    tag: String,
    imageId: Number,
    imageFactor: Number,
    blockPosition: Number,
  },
  emits: ['dataLoaded', 'isInScreen', 'indicatorMove'],
  data() {
    return {
      imageData: undefined,
      shouldRunAnimation: true,
      clickDuration: 0,
      timeoutEvent: undefined,
      indicatorInformation: { visible: false },
    };
  },
  methods: {
    loadFullImageView() {
      const diffTime = Date.now() - this.clickDuration;
      if (diffTime < 300) {
        this.$router.push({
          path: `/image/${this.imageData.id}`,
          query: { image: JSON.stringify(this.imageData) },
        });
      }
    },
  },
  computed: {
    imageAppearAnimation() {
      return {
        relatedImageBase: this.shouldRunAnimation,
        relatedImageDisappearBase: this.runDisapearAnimation,
      };
    },
    imageHover() {
      return {
        transition: 'height 0.2s',
      };
    },
    position() {
      return {
        position: 'absolute',
        top: this.imagePosition.top + 'px',
        left: this.imagePosition.left + 'px',
      };
    },
    textWidth() {
      return {
        width: this.focus
          ? thumbnailWidth(this.imageFactor) + 'px'
          : relatedThumbnailWidth(this.imageFactor) + 'px',
      };
    },
    imageHeight() {
      return getImageHeight(this.focus, this.imageFactor);
    },
    imageWidth() {
      return getImageWidth(this.focus, this.imageFactor);
    },
    getIndicator() {
      return {
        position: 'absolute',
        top: this.indicatorInformation.top + 'px',
        left: this.indicatorInformation.left + 'px',
        transform: 'rotate(' + this.indicatorInformation.rotation + 'deg)',
      };
    },
    getVisibility() {
      return this.indicatorInformation.visible;
    },
  },
  mounted() {
    dataFetch.getImageById(this.imageId).then((data) => {
      if (data.length > 0) {
        this.imageData = data[0];
        setTimeout(() => (this.shouldRunAnimation = false), 3000);
        this.$nextTick(() => {
          this.$emit('dataLoaded');
          this.$emit('isInScreen');
        });
      }
    });
  },
};
</script>

<style scoped>
@import './css/canvas.css';
@import './css/text.css';
@import './css/relatedImageAnimation.css';
@import '../shared/pointer.css';
</style>
