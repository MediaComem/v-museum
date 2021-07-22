<template>
  <div v-if="image && display" :style="{ height: imageHeight + 'px' }">
    <p v-if="align === 'top' && justify === 'start'" class="relatedImageBase index-font start-text-align">
      {{ image.tag["@value"] }}
    </p>
    <p v-if="align === 'top' && justify === 'end'" class="relatedImageBase index-font end-text-align">
      {{ image.tag["@value"] }}
    </p>
    <img
      class="relatedImageBase"
      :src="image.result.imagePaths.large"
      :alt="image.result.id"
      :style="{ height: imageHeight + 'px' }"
    />
    <p v-if="align === 'bottom' && justify === 'start'" class="relatedImageBase index-font start-text-align">
      {{ image.tag["@value"] }}
    </p>
    <p v-if="align === 'bottom' && justify === 'end'" class="relatedImageBase index-font end-text-align">
      {{ image.tag["@value"] }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    image: Object,
    display: Boolean,
    imageHeight: Number,
    align: String,
    justify: String,
  },
};
</script>

<style>
@import "./imageselector.css";
@import "./relatedImageAnimation.css";

.start-text-align {
    text-align: start;
}

.end-text-align {
    text-align: end;
}
</style>
