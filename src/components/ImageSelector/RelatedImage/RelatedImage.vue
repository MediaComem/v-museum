<template>
  <div
    v-if="image && image.length > 0 && image[0].display"
    :style="getImage"
  >
    <!--p
      v-if="align === 'top' || align === 'middle'"
      class="relatedImageBase index-font"
      :class="textComponentClass"
    >
      {{ image[0].image.tag["@value"] }}
    </p-->
    <img
      style="object-fit: none"
      :style="getImage"
      class="relatedImageBase"
      :src="this.image[0].image.result.imagePaths.large"
      :alt="image[0].image.result.id"
    />
    <!--p
      v-if="align === 'bottom'"
      class="relatedImageBase index-font "
      :class="textComponentClass"
    >
      {{ image[0].image.tag["@value"] }}
    </p-->
  </div>
</template>

<script>
export default {
  methods: {
    getHeight() {
      return this.image[0].hover
        ? this.imageHeight * 2
        : this.imageHeight;
    }
  },
  props: {
    image: Object,
    imageHeight: Number,
    imageWidth: Number,
    align: String,
    justify: String,
    hover: Boolean,
    position: Number,
  },
  computed: {
    getImage() {
      return {
        height: this.getHeight() + 'px',
        width: this.imageWidth + 'px',
      }
    },
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
