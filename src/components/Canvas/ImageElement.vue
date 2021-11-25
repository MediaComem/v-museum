<template>
  <div :style="position" v-if="imageData">
    <p v-if="isTop && !hasFocus" :class="justification" :style="textWidth">
      {{ tag }}
    </p>
    <img
      :src="imageData.imagePaths.large"
      :height="getImageHeight"
      :width="getImageWidth"
    />
    <p v-if="!isTop && !hasFocus" :class="justification" :style="textWidth">
      {{ tag }}
    </p>
    <div v-if="hasFocus" :style="textWidth">
      <div class="left">
        <p>
          Illustration: &nbsp;
        </p>
        <p>
          {{ imageData.author }}
        </p>
      </div>
      <div class="left">
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
  thumbnailHeight,
  thumbnailWidth,
  relatedThumbnailHeight,
  relatedThumbnailWidth,
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
    justification() {
      return {
        left: this.isLeft,
        right: !this.isLeft,
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
    getImageHeight() {
      return this.hasFocus
        ? thumbnailHeight(this.imageFactor)
        : relatedThumbnailHeight(this.imageFactor);
    },
    getImageWidth() {
      return this.hasFocus
        ? thumbnailWidth(this.imageFactor)
        : relatedThumbnailWidth(this.imageFactor);
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
.left {
  display: flex;
  justify-content: flex-start;
}

.right {
  display: flex;
  justify-content: flex-end;
}
</style>
