<template>
  <div :ref="'block'">
    <div
      v-if="getVisibility"
      :style="getIndicator"
      @click="
        $emit('indicatorMove', {
          left: imagePosition.left,
          top: imagePosition.top,
        })
      "
    >
      <Indicator :tag="tag" :rotation="indicatorInformation.textRotation" :isSpecialDevice="isSpecialDevice" />
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
      <div>
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
        <div 
          class="clickable" 
          :class="overlay" 
          :style="imageOverlay"
          @mousedown="clickDuration = Date.now()"
          @mouseup="loadFullImageView()"></div>
      </div>
      <div v-if="focus" :style="textWidth">
        <div class="text_left">
          <p class="font-size-information" :style="informationTextSize">
            Illustration: &nbsp;
          </p>
          <p class="font-size-information-text" :style="informationTextSize">
            {{ imageData.author }}
          </p>
        </div>
        <div class="text_left">
          <p class="font-size-information margin-story" :style="informationTextSize">
            Story: &nbsp;
          </p>
          <p class="font-size-information-text margin-story" :style="informationTextSize">
            {{ imageData.title }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
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
          // Inform that the element is loaded and we can check the collision
          // And also check if the element is displayed in the viewport.
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
    isSpecialDevice: Boolean,
  },
  emits: ['dataLoaded', 'isInScreen', 'indicatorMove'],
  data() {
    return {
      imageData: undefined,
      shouldRunAnimation: true,
      clickDuration: 0,
      timeoutEvent: undefined,
      indicatorInformation: { visible: false, textRotation: 0 },
      overlayTop: 0,
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
    overlay() {
      return {
        overlay: !this.focus,
      };
    },
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
    imageOverlay() {
      return {
        height: `${this.imageHeight}px`,
        width: `${this.imageWidth}px`,
        top: `${this.overlayTop}px`,
        position: 'absolute',
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
      if (this.isSpecialDevice) {
        return {
          width: this.focus
            ? thumbnailWidth(this.imageFactor) + 'px'
            : relatedThumbnailWidth(this.imageFactor) + 'px',
          'font-size': '70px',
        };
      }
      return {
          width: this.focus
            ? thumbnailWidth(this.imageFactor) + 'px'
            : relatedThumbnailWidth(this.imageFactor) + 'px',
        };
    },
    informationTextSize() {
      if (this.isSpecialDevice) {
        return {
          'font-size': '50px',
          height: '50px',
        };
      }
      return {};
    },
    imageHeight() {
      return getImageHeight(this.focus, this.imageFactor);
    },
    imageWidth() {
      return getImageWidth(this.focus, this.imageFactor);
    },
    getIndicator() {
      const variation = this.indicatorInformation.rotation > 0 ? this.getFullHistoryMode ? this.isSpecialDevice ? 72 : -80 : this.isSpecialDevice ? 100 : -50 : this.isSpecialDevice ? 150 : 50;
      return {
        position: 'absolute',
        top: this.indicatorInformation.top + variation + 'px',
        left: this.indicatorInformation.left + 'px',
        transform: 'rotate(' + this.indicatorInformation.rotation + 'deg)',
      };
    },
    getVisibility() {
      return this.indicatorInformation.visible;
    },
    ...mapGetters({
      getFullHistoryMode: "getFullHistoryMode",
    }),
  },
  mounted() {
    dataFetch.getImageById(this.imageId).then((data) => {
      if (data.length > 0) {
        this.imageData = data[0];
        setTimeout(() => (this.shouldRunAnimation = false), 3000);
        this.$nextTick(() => {
          this.overlayTop = this.$refs['tag'].clientHeight + 8;
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

.overlay {
  background: #00000010;
}
</style>
