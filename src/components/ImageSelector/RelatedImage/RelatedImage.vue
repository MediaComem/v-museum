<template>
  <div v-if="image && image.length > 0 && image[0].display" :style="{ height: imageHeight + 'px' }">
    <p
      v-if="align === 'top' && justify === 'start'"
      class="relatedImageBase index-font start-text-align"
      :style="componentWidthStart"
    >
      {{ image[0].image.tag["@value"] }}
    </p>
    <p
      v-if="align === 'middle' && justify === 'start'"
      class="relatedImageBase index-font start-text-align"
    >
      {{ image[0].image.tag["@value"] }}
    </p>
    <p
      v-if="align === 'top' && justify === 'end'"
      class="relatedImageBase index-font end-text-align"
      :style="componentWidthEnd"
    >
      {{ image[0].image.tag["@value"] }}
    </p>
    <img
      class="relatedImageBase"
      :src="image[0].image.result.imagePaths.large"
      :alt="image[0].image.result.id"
      :style="{ height: (imageHeight / 10) * 9 + 'px', componentWidthEnd }"
    />
    <p
      v-if="align === 'bottom' && justify === 'start'"
      class="relatedImageBase index-font start-text-align"
      :style="componentWidthStart"
    >
      {{ image[0].image.tag["@value"] }}
    </p>
    <p
      v-if="align === 'bottom' && justify === 'end'"
      class="relatedImageBase index-font end-text-align"
      :style="componentWidthEnd"
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
  computed: {
    componentWidthStart() {
      return { paddingLeft: this.imageWidth / 6 + "px" };
    },
    componentWidthEnd() {
      return { width: this.imageWidth + "px" };
    },
  },
};
</script>

<style>
@import "../imageselector.css";
@import "../relatedImageAnimation.css";
@import "./relatedimage.css";
</style>
