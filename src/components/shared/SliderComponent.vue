<template>
  <el-container>
    <el-main>
      <div class="block">
        <el-slider
          vertical
          v-model="step"
          height="200px"
          :max="6"
          :show-tooltip="false"
        >
        </el-slider>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import "bootstrap";
import "bootstrap/scss/bootstrap.scss";

export default {
  methods: {},
  name: "Slider",
  components: {},
  data() {
    return {
      step: 3,
    };
  },
};
</script>

<style></style>
