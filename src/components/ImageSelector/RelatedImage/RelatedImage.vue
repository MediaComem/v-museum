<template>
  <div v-if="image && display" :style="{ height: imageHeight + 'px' }">
    <p
      v-if="align === 'top' && justify === 'start'"
      class="relatedImageBase index-font start-text-align"
      :style="componentWidthStart"
    >
      {{ image.tag["@value"] }}
    </p>
    <p
      v-if="align === 'middle' && justify === 'start'"
      class="relatedImageBase index-font start-text-align"
    >
      {{ image.tag["@value"] }}
    </p>
    <p
      v-if="align === 'top' && justify === 'end'"
      class="relatedImageBase index-font end-text-align"
      :style="componentWidthEnd"
    >
      {{ image.tag["@value"] }}
    </p>
    <img
      class="relatedImageBase"
      :src="image.result.imagePaths.large"
      :alt="image.result.id"
      :style="{ height: (imageHeight / 10) * 9 + 'px', componentWidthEnd }"
    />
    <p
      v-if="align === 'bottom' && justify === 'start'"
      class="relatedImageBase index-font start-text-align"
      :style="componentWidthStart"
    >
      {{ image.tag["@value"] }}
    </p>
    <p
      v-if="align === 'bottom' && justify === 'end'"
      class="relatedImageBase index-font end-text-align"
      :style="componentWidthEnd"
    >
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

.start-text-align {
  text-align: start;
}

.end-text-align {
  text-align: end;
}
</style>
