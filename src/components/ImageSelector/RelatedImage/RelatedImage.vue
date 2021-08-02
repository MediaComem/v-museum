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
        v-if="align === 'bottom'"
        class="relatedImageBase image-custom-bottom"
        :src="getImage()"
        :alt="image[0].image.result.id"
      />
      <img
        v-if="align !== 'bottom'"
        class="relatedImageBase image-custom"
        :src="getImage()"
        :alt="image[0].image.result.id"
      />
    <p
      v-if="align === 'bottom'"
      class="relatedImageBase index-font "
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
  methods: {
    getImage() {
      return this.hover ? this.image[0].image.result.imagePaths.large : this.image[0].image.result.imagePaths.square;
    },
    getMargin() {
      if (this.align === 'bottom'){
        return 350;
      }
      else {
        return 0;
      }
    }
  },
  computed: {
    textComponentClass() {
      return {
        startTextAlign: this.justify === "start",
        endTextAlign: this.justify === "end",
      };
    },
    displayImage() {
      return {
        'margin-top': this.getMargin() + 'px',
      }
    },
  },
};
</script>

<style>
@import "../imageselector.css";
@import "../relatedImageAnimation.css";
@import "./relatedimage.css";
</style>
