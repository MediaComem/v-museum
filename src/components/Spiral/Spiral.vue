<template>
  <div id="chart" ref="spiral"></div>
</template>

<script>
import * as d3 from "d3";
export default {
  watch: {
  },
  props: {
    width: Number,
    heigth: Number,
  },
  data() {
    return {
      spiral: undefined,
    };
  },
  mounted() {

    this.spiral = this.$refs.spiral;
    var centerX = this.width / 2;
    var centerY = this.heigth / 2;
    var radius = 150;
    var coils = 8;
    var rotation = 2 * Math.PI;
    var thetaMax = coils * 2 * Math.PI;
    var awayStep = radius / thetaMax;
    var chord = 20;

    var new_time = [];

    for (let theta = chord / awayStep; theta <= thetaMax; ) {
      let away = awayStep * theta;
      let around = theta + rotation;

      let x = centerX + Math.cos(around) * away;
      let y = centerY + Math.sin(around) * away;

      theta += chord / away;

      new_time.push({ x: x, y: y });
    }

    let svg = d3
      .select("#chart")
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .append("g");

    let lineFunction = d3.svg
      .line()
      .x(function(d) {
        return d.x;
      })
      .y(function(d) {
        return d.y;
      })
      .interpolate("cardinal");

    svg
      .append("path")
      .attr("d", lineFunction(new_time))
      .attr("stroke", "gray")
      .attr("stroke-width", 0.5)
      .attr("fill", "none");
  },
};
</script>

<style scoped>
@import "./spiral.css";
</style>
