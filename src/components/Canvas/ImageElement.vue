<template>
  <div :style="position" v-if="imageData">
    <p v-if="isTop && !focus" class="related-text" :class="textJustification" :style="textWidth">
      {{ tag }}
    </p>
    <img
      :ref="'image'"
      class="relatedImageBase"
      :src="imageData.imagePaths.large"
      :height="imageHeight"
      :width="imageWidth"
      @click="loadFullImageView()"
    />
    <p v-if="!isTop && !focus" class="related-text" :class="textJustification" :style="textWidth">
      {{ tag }}
    </p>
    <div v-if="focus" :style="textWidth">
      <div class="text_left">
        <p class="font-size-information">
          Illustration: &nbsp;
        </p>
        <p class="font-size-information">
          {{ imageData.author }}
        </p>
      </div>
      <div class="text_left">
        <p class="font-size-information">
          Story: &nbsp;
        </p>
        <p class="font-size-information">
          {{ imageData.title }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import dataFetch from "../../api/dataFetching";
import {
  thumbnailWidth,
  relatedThumbnailWidth,
  getImageWidth,
  getImageHeight,
} from "./service/image_management_service";

export default {
  watch: {
    imageId: function(newVal) {
      this.imageData = undefined;
      dataFetch.getImageById(newVal).then((data) => {
        if (data.length > 0) {
          this.imageData = data[0];
        }
      });
    },
  },
  props: {
    imagePosition: Object,
    focus: Boolean,
    tag: String,
    imageId: Number,
    imageFactor: Number,
    blockPosition: Number,
  },
  data() {
    return {
      imageData: undefined,
    };
  },
  methods: {
    loadFullImageView() {
      this.$router.push({
        path: `/image/${this.imageData.id}`,
        query: {image: JSON.stringify(this.imageData)}
      });
    },
  },
  computed: {
    isTop() {
      return this.blockPosition === 3 || this.blockPosition === 6;
    },
    textJustification() {
      return {
        text_left: this.blockPosition === 4 || this.blockPosition === 5 || this.blockPosition === 6,
        text_right: this.blockPosition === 1 || this.blockPosition === 2 || this.blockPosition === 3,
      };
    },
    position() {
      return {
        position: "absolute",
        top: this.imagePosition.top + "px",
        left: this.imagePosition.left + "px",
      };
    },
    textWidth() {
      return {
        width: this.focus
          ? thumbnailWidth(this.imageFactor) + "px"
          : relatedThumbnailWidth(this.imageFactor) + "px",
      };
    },
    imageHeight() {
      return getImageHeight(this.focus, this.imageFactor);
    },
    imageWidth() {
      return getImageWidth(this.focus, this.imageFactor);
    },
  },
  mounted() {
    dataFetch.getImageById(this.imageId).then((data) => {
      if (data.length > 0) {
        this.imageData = data[0];
      }
    });
  },
};
</script>

<style scoped>
@import "./css/canvas.css";
@import "./css/text.css";
@import "./css/relatedImageAnimation.css";
</style>
