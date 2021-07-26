<template>
  <div
    v-if="image && image.length > 0 && image[0].display"
    :style="{ height: imageHeight + 'px' }"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <p
      v-if="align === 'top' || align === 'middle'"
      class="relatedImageBase index-font"
      :class="textComponentClass"
    >
      {{ image[0].image.tag["@value"] }}
    </p>
    <img
      class="relatedImageBase"
      :src="image[0].image.result.imagePaths.square"
      :alt="image[0].image.result.id"
      :style="{
        height: (imageHeight / 20) * 9 + 'px',
        componentWidthEnd,
        marginTop: (imageHeight / 20) * 9 + 'px',
      }"
    />
    <p
      v-if="align === 'bottom'"
      class="relatedImageBase index-font"
      :class="textComponentClass"
    >
      {{ image[0].image.tag["@value"] }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    image: Object,
    imageHeight: Number,
    imageWidth: Number,
    align: String,
    justify: String,
  },
  data() {
    return {
      hover: false,
    };
  },
  computed: {
    textComponentClass() {
      return {
        startTextAlign: this.justify === "start",
        endTextAlign: this.justify === "end",
      };
    },
  },
};
</script>

<style>
@import "../imageselector.css";
@import "../relatedImageAnimation.css";
@import "./relatedimage.css";
</style>
