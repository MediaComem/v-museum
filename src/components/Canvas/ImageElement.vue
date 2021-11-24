<template>
  <div :style="position" v-if="imageData">
    <p v-if="isTop && !hasFocus" :class="justification" :style="textWidth">
      {{ tag }}
    </p>
    <img
      :src="imageData.imagePaths.large"
      :height="imageHeight"
      :width="imageWidth"
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

export default {
  props: {
    imageHeight: Number,
    imageWidth: Number,
    imagePosition: Object,
    isTop: Boolean,
    isLeft: Boolean,
    hasFocus: Boolean,
    tag: String,
    imageId: Number,
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
        width: this.imageWidth + "px",
      };
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
