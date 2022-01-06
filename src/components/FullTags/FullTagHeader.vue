<template>
  <el-row class="display-element">
    <el-col :span="1" class="align-element justify-browser">
      <img class="clickable" src="@/assets/shared/vector.png" @click="loadOnboarding()" />
    </el-col>
    <el-col :span="3" class="align-element justify-text">
      <h2 class="clickable" @click="loadOnboarding()">Home</h2>
    </el-col>
    <el-col :span="6" :offset="5" class="tag-display">
      <h2>{{ tag }}</h2>
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: {
    tag: String,
  },
  methods: {
    loadOnboarding() {
      this.$router.push({
        path: `/`,
        query: {tag: encodeURIComponent(this.tag)}
      });
    },
  },
};
</script>

<style scoped>
@import "../shared/pointer.css";

h2 {
  font-size: 24px;
}

.display-element {
  height: 10vh;
  width: 100vw;
}

.tag-display {
  display: flex;
  justify-content: center;
  align-items: center;
}

.align-element {
  display: flex;
  align-items: center;
}

.justify-browser {
  justify-content: flex-end;
  margin-right: 10px;
}

.justify-text {
  justify-content: flex-start;
}
</style>
