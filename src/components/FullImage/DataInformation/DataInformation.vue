<template>
  <el-row style="height: 1;"> </el-row>
  <el-row>
    <h1 :style="h1FontSize">
      {{ imageData.title }}
    </h1>
  </el-row>
  <el-row>
    <p class="gray-text" :style="pFontSize">Illustrator</p>
  </el-row>
  <el-row>
    <h3 :style="h3FontSize">
      {{ imageData.author }}
    </h3>
  </el-row>
  <el-row>
    <p class="gray-text" :style="pFontSize">
      Magazine Issue
    </p>
  </el-row>
  <el-row>
    <p :style="pFontSize">
      {{ imageData.medium }}
    </p>
  </el-row>
  <el-row>
    <p class="gray-text" :style="pFontSize">
      Keywords
    </p>
  </el-row>
  <el-row>
    <p v-if="tags.length === 0" class="gray-text" style="text-align: left" :style="pFontSize">
      No related keyword
    </p>
    <p v-if="tags.length > 0" style="text-align: left" :style="pFontSize">
      {{ tags.join(", ") }}
    </p>
  </el-row>
  <el-row v-if="storyCollection">
    <p :style="pFontSize">{{ currentIndex + 1 }} / {{ storyCollection.length }}</p>
  </el-row>
  <el-row v-if="storyCollection && storyCollection.length > 1">
    <div style="display: flex; cursor: pointer" @click="previousImage()">
      <div>
        <img src="@/assets/fullimage/left_arrow.svg" />
      </div>
      <p :style="pFontSize">&nbsp; Previous &nbsp;</p>
    </div>
    <p :style="pFontSize">|</p>
    <div style="display: flex; cursor: pointer" @click="nextImage()">
      <p :style="pFontSize">&nbsp; Next &nbsp;</p>
      <div>
        <img src="@/assets/fullimage/right_arrow.svg" />
      </div>
    </div>
  </el-row>
  <el-row style="height: auto; padding-bottom: 24px; max-height: 15vh">
    <span :style="spanFontSize">{{ imageData.description }}</span>
  </el-row>
</template>

<script>
export default {
  props: {
    imageData: Object,
    tags: Array,
    storyCollection: Array,
    windowHeight: Number,
    windowWidth: Number,
  },
  emits: ["loadImage"],
  data() {
    return {
      // Index of the current displayed image
      currentIndex: undefined,
    };
  },
  methods: {
    setupCurrentIndex(index) {
      this.currentIndex = index;
    },
    previousImage() {
      if (this.currentIndex > 0) {
        this.currentIndex = this.currentIndex - 1;
      } else {
        this.currentIndex = this.storyCollection.length - 1;
      }
      this.$emit("loadImage", this.currentIndex);
    },
    nextImage() {
      if (this.currentIndex < this.storyCollection.length - 1) {
        this.currentIndex = this.currentIndex + 1;
      } else {
        this.currentIndex = 0;
      }
      this.$emit("loadImage", this.currentIndex);
    },
  },
  computed: {
    h1FontSize() {
      return {
        'font-size': this.windowHeight > 1700 && this.windowWidth < 1000 ? '36px' : '24px',
      }
    },
    h3FontSize() {
      return {
        'font-size': this.windowHeight > 1700 && this.windowWidth < 1000 ? '30px' : '18px',
      }
    },
    pFontSize() {
      return {
        'font-size': this.windowHeight > 1700 && this.windowWidth < 1000 ? '26px' : '14px',
      }
    },
    spanFontSize() {
      return {
        'font-size': this.windowHeight > 1700 && this.windowWidth < 1000 ? '28px' : '16px',
      }
    },
  },
};
</script>

<style scoped>
h1 {
  font-weight: normal;
  font-size: 24px;
  margin: 0;
  padding-bottom: 1vh;
}

h3 {
  font-weight: normal;
  font-size: 18px;
  margin: 0;
  padding-bottom: 1vh;
}

p {
  font-weight: normal;
  font-size: 14px;
  margin: 0;
  padding-bottom: 1vh;
}

span {
  font-weight: normal;
  font-size: 16px;
  margin: 0;
}

.gray-text {
  padding: 0;
  color: gray;
}
</style>
