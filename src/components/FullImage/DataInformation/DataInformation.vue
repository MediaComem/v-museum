<template>
  <el-row style="height: 1;"> </el-row>
  <el-row>
    <h1>
      {{ imageData.title }}
    </h1>
  </el-row>
  <el-row>
    <p class="gray-text">Illustrator</p>
  </el-row>
  <el-row>
    <h3>
      {{ imageData.author }}
    </h3>
  </el-row>
  <el-row>
    <p class="gray-text">
      Magazine Issue
    </p>
  </el-row>
  <el-row>
    <p>
      {{ imageData.medium }}
    </p>
  </el-row>
  <el-row>
    <p class="gray-text">
      Keywords
    </p>
  </el-row>
  <el-row>
    <p v-if="tags.length === 0" class="gray-text" style="text-align: left">
      No related keyword
    </p>
    <p v-if="tags.length > 0" style="text-align: left">
      {{ tags.join(", ") }}
    </p>
  </el-row>
  <el-row v-if="storyCollection">
    <p>{{ currentIndex + 1 }} / {{ storyCollection.length }}</p>
  </el-row>
  <el-row v-if="storyCollection && storyCollection.length > 1">
    <div style="display: flex; cursor: pointer" @click="previousImage()">
      <div>
        <img src="@/assets/fullimage/left_arrow.svg" />
      </div>
      <p>&nbsp; Previous &nbsp;</p>
    </div>
    <p>|</p>
    <div style="display: flex; cursor: pointer" @click="nextImage()">
      <p>&nbsp; Next &nbsp;</p>
      <div>
        <img src="@/assets/fullimage/right_arrow.svg" />
      </div>
    </div>
  </el-row>
  <el-row style="height: auto; padding-bottom: 24px; max-height: 15vh">
    <span>{{ imageData.description }}</span>
  </el-row>
</template>

<script>
export default {
  props: {
    imageData: Object,
    tags: Array,
    storyCollection: Array,
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
};
</script>

<style scoped>
h1 {
  font-weight: normal;
  font-size: 24px;
  margin: 0;
  padding-bottom: 1vh;
}

h2 {
  font-weight: normal;
  font-size: 18px;
  color: gray;
  margin: 0;
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
