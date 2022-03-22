<template>
  <el-row :gutter="20">
    <el-col :span="8">
      <div class="align-element">
        <img
          class="return-size clickable"
          src="@/assets/shared/Vector.svg"
          @click="loadOnboarding()"
        />
        <h2 class="clickable" @click="loadOnboarding()">Home</h2>
      </div>
    </el-col>
    <el-col :span="8" class="tag-display">
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
        query: { tag: encodeURIComponent(this.tag) },
      });
    },
  },
};
</script>

<style scoped>
@import '../pointer.css';

@media only screen and (min-width: 1px) and (max-width: 699px) {
  h2 {
    font-size: 16px;
    margin-left: 5px;
  }

  .return-size {
    width: 16px;
    height: 15px;
  }
}

@media only screen and (min-width: 700px) {
  h2 {
    font-size: 24px;
    margin-left: 5px;
  }

  .return-size {
    width: 24px;
    height: 21px;
  }
}

.tag-display {
  display: flex;
  justify-content: center;
  align-items: center;
}

.align-element {
  display: flex;
  align-items: center;
  flex-direction: row;
  margin-left: 10px;
}

.justify-text {
  justify-content: flex-start;
}
</style>
