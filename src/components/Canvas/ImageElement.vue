<template>
  <div :style="position" v-if="imageData">
    <p v-if="isTop && !hasFocus" :class="textJustification" :style="textWidth">
      {{ tag }}
    </p>
    <img
      :src="imageData.imagePaths.large"
      :height="imageHeight"
      :width="imageWidth"
    />
    <p v-if="!isTop && !hasFocus" :class="textJustification" :style="textWidth">
      {{ tag }}
    </p>
    <div v-if="hasFocus" :style="textWidth">
      <div class="text_left">
        <p>
          Illustration: &nbsp;
        </p>
        <p>
          {{ imageData.author }}
        </p>
      </div>
      <div class="text_left">
        <p>
          Story: &nbsp;
        </p>
        <p>
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
  getImageHeight
} from "./image_management_service";

export default {
  props: {
    imagePosition: Object,
    isTop: Boolean,
    isLeft: Boolean,
    hasFocus: Boolean,
    tag: String,
    imageId: Number,
    imageFactor: Number,
  },
  data() {
    return {
      imageData: undefined,
    };
  },
  computed: {
    textJustification() {
      return {
        text_left: this.isLeft,
        text_right: !this.isLeft,
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
        width: this.hasFocus
          ? thumbnailWidth(this.imageFactor) + "px"
          : relatedThumbnailWidth(this.imageFactor) + "px",
      };
    },
    imageHeight() {
      return getImageHeight(this.hasFocus, this.imageFactor);
    },
    imageWidth() {
      return getImageWidth(this.hasFocus, this.imageFactor);
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
.text_left {
  display: flex;
  justify-content: flex-start;
}

.text_right {
  display: flex;
  justify-content: flex-end;
}
</style>
