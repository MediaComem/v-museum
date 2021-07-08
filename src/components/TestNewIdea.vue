
<template>
  <ul class="infinite-list" v-infinite-scroll="load" style="overflow:auto">
    <li v-for="(ele, i) in data" :key="i" class="infinite-list-item">{{ i }}</li>
  </ul>
</template>

<script>
import axios from "axios";

export default {
  name: "SliderComponent",
  data() {
    return {
      initialLoad: true,
      data: [],
      step: 3,
      heightScreen: undefined,
      carousel: undefined,
      maxCarouselSize: 0,
      inLoading: false,
    };
  },
  methods: {
    load() {
      console.log("Load");
    },
    async initContent() {
      try {
        const response = await axios.get(
          "http://localhost:3000/getInitContent/193",
          {
            headers: {
              withCredentials: true,
            },
          }
        );
        this.data = response.data;
        this.maxCarouselSize = this.data.length;
      } catch (err) {
        console.log(err);
      }
    },
  },
  mounted() {
    axios.defaults.withCredentials = true;
    this.initContent();
  },
};
</script>

<style>
.el-carousel__item {
  overflow: hidden !important;
}

.el-carousel__item.is-animating {
  -webkit-transition: -webkit-transform 0.1s ease-in-out;
  transition: -webkit-transform 0.1s ease-in-out;
  transition: transform 0.1s ease-in-out;
  transition: transform 0.1s ease-in-out, -webkit-transform 0.1s ease-in-out;
  transition: transform 0.1s ease-in-out, -webkit-transform 0.1s ease-in-out;
}

.el-carousel__indicators--vertical {
  width: 0px;
  height: 0px;
}

.el-slider__bar {
  background-color: unset;
}

.custom-row {
  margin-top: 200px;
}
</style>
