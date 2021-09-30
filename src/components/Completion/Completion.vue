<template>
  <svg
    :width="width + 'px'"
    :height="height + 'px'"
    :viewBox="viewBox ? viewBox : '-2 -2.75 4 5.5'"
    enable-background="new 0 0 300 300"
    xml:space="preserve"
    :style="positionElement"
  >
    <path
      :style="path"
      fill="none"
      :stroke="emptyColor"
      stroke-width="0.04"
      stroke-miterlimit="10"
      :d="spiral.join(' ')"
    />
  </svg>

  <svg
    :width="width + 'px'"
    :height="height + 'px'"
    :viewBox="viewBox ? viewBox : '-2 -2.75 4 5.5'"
    enable-background="new 0 0 300 300"
    xml:space="preserve"
    :style="positionElement"
  >
    <path
      :style="path2"
      fill="none"
      :stroke="completeColor"
      stroke-width="0.04"
      stroke-miterlimit="10"
      :d="completed.join(' ')"
    />
  </svg>
</template>

<script>
import { mapGetters, mapState } from "vuex";
export default {
  name: "Completion",
  props: {
    decade: String,
    height: Number,
    width: Number,
    topPosition: Number,
    leftPosition: Number,
    emptyColor: String,
    completeColor: String,
    viewBox: String,
  },
  watch: {
    decade: function() {
      this.setComplet();
    },
    completionData: {
      handler() {
        this.setComplet();
      },
      deep: true,
    },
  },
  data() {
    return {
      index: 0,
      spiral: [],
      completed: [],
    };
  },
  methods: {
    setComplet() {
      const completion = this.completion(this.decade);
      this.completed = completion
        ? this.spiral.slice(0, completion.completion)
        : this.spiral.slice(0, 0);
    },
  },
  mounted() {
    this.spiral.push("M 0 0");
    this.spiral.push("M 0 0 C 0 0 0.0073 0.011 0 0.0156");
    this.spiral.push("M 0 0.0156 C -0.0073 0.0203 -0.026 0.0164 -0.0313 0");
    this.spiral.push("M -0.0313 0 C -0.0365 -0.0164 -0.0253 -0.0415 0 -0.0469");
    this.spiral.push("M 0 -0.0469 C 0.0253 -0.0522 0.0571 -0.0341 0.0625 0");
    this.spiral.push("M 0.0625 0 C 0.0679 0.0341 0.0428 0.0727 0 0.0781");
    this.spiral.push("M 0 0.0781 C -0.0428 0.0836 -0.0883 0.0515 -0.0938 0");
    this.spiral.push("M -0.0938 0 C -0.0992 -0.0515 -0.0602 -0.1039 0 -0.1094");
    this.spiral.push("M 0 -0.1094 C 0.0602 -0.1149 0.1195 -0.0688 0.125 0");
    this.spiral.push("M 0.125 0 C 0.1305 0.0688 0.0775 0.1351 0 0.1406");
    this.spiral.push("M 0 0.1406 C -0.0775 0.1461 -0.1507 0.0861 -0.1563 0");
    this.spiral.push("M -0.1563 0 C -0.1618 -0.0861 -0.0948 -0.1664 0 -0.1719");
    this.spiral.push("M 0 -0.1719 C 0.0948 -0.1774 0.182 -0.1034 0.1875 0");
    this.spiral.push("M 0.1875 0 C 0.193 0.1034 0.1121 0.1976 0 0.2031");
    this.spiral.push("M 0 0.2031 C -0.1121 0.2086 -0.2132 0.1207 -0.2188 0");
    this.spiral.push("M -0.2188 0 C -0.2243 -0.1207 -0.1293 -0.2289 0 -0.2344");
    this.spiral.push("M 0 -0.2344 C 0.1293 -0.2399 0.2445 -0.1379 0.25 0");
    this.spiral.push("M 0.25 0 C 0.2555 0.1379 0.1466 0.2601 0 0.2656");
    this.spiral.push("M 0 0.2656 C -0.1466 0.2711 -0.2757 0.1552 -0.2813 0");
    this.spiral.push("M -0.2813 0 C -0.2868 -0.1552 -0.1639 -0.2914 0 -0.2969");
    this.spiral.push("M 0 -0.2969 C 0.1639 -0.3024 0.307 -0.1725 0.3125 0");
    this.spiral.push("M 0.3125 0 C 0.318 0.1725 0.1811 0.3226 0 0.3281");
    this.spiral.push("M 0 0.3281 C -0.1811 0.3336 -0.3382 0.1898 -0.3438 0");
    this.spiral.push("M -0.3438 0 C -0.3493 -0.1898 -0.1984 -0.3539 0 -0.3594");
    this.spiral.push("M 0 -0.3594 C 0.1984 -0.3649 0.3695 -0.2071 0.375 0");
    this.spiral.push("M 0.375 0 C 0.3805 0.2071 0.2157 0.3851 0 0.3906");
    this.spiral.push("M 0 0.3906 C -0.2157 0.3961 -0.4007 0.2243 -0.4063 0");
    this.spiral.push("M -0.4063 0 C -0.4118 -0.2243 -0.2329 -0.4164 0 -0.4219");
    this.spiral.push("M 0 -0.4219 C 0.2329 -0.4274 0.432 -0.2416 0.4375 0");
    this.spiral.push("M 0.4375 0 C 0.443 0.2416 0.2502 0.4476 0 0.4531");
    this.spiral.push("M 0 0.4531 C -0.2502 0.4586 -0.4632 0.2588 -0.4688 0");
    this.spiral.push("M -0.4688 0 C -0.4743 -0.2588 -0.2674 -0.4789 0 -0.4844");
    this.spiral.push("M 0 -0.4844 C 0.2674 -0.4899 0.4945 -0.2761 0.5 0");
    this.spiral.push("M 0.5 0 C 0.5055 0.2761 0.2848 0.5101 0 0.5156");
    this.spiral.push("M 0 0.5156 C -0.2848 0.5211 -0.5258 0.2934 -0.5313 0");
    this.spiral.push("M -0.5313 0 C -0.5367 -0.2934 -0.302 -0.5414 0 -0.5469");
    this.spiral.push("M 0 -0.5469 C 0.302 -0.5524 0.557 -0.3106 0.5625 0");
    this.spiral.push("M 0.5625 0 C 0.568 0.3106 0.3192 0.5726 0 0.5781");
    this.spiral.push("M 0 0.5781 C -0.3192 0.5836 -0.5883 0.3279 -0.5938 0");
    this.spiral.push("M -0.5938 0 C -0.5992 -0.3279 -0.3365 -0.6039 0 -0.6094");
    this.spiral.push("M 0 -0.6094 C 0.3365 -0.6149 0.6195 -0.3451 0.625 0");
    this.spiral.push("M 0.625 0 C 0.6305 0.3451 0.3538 0.6351 0 0.6406");
    this.spiral.push("M 0 0.6406 C -0.3538 0.6461 -0.6508 0.3624 -0.6563 0");
    this.spiral.push("M -0.6563 0 C -0.6617 -0.3624 -0.371 -0.6664 0 -0.6719");
    this.spiral.push("M 0 -0.6719 C 0.371 -0.6774 0.682 -0.3796 0.6875 0");
    this.spiral.push("M 0.6875 0 C 0.693 0.3796 0.3883 0.6976 0 0.7031");
    this.spiral.push("M 0 0.7031 C -0.3883 0.7086 -0.7133 0.3969 -0.7188 0");
    this.spiral.push("M -0.7188 0 C -0.7242 -0.3969 -0.4056 -0.7289 0 -0.7344");
    this.spiral.push("M 0 -0.7344 C 0.4056 -0.7399 0.7445 -0.4142 0.75 0");
    this.spiral.push("M 0.75 0 C 0.7555 0.4142 0.4228 0.7601 0 0.7656");
    this.spiral.push("M 0 0.7656 C -0.4228 0.7711 -0.7758 0.4314 -0.7813 0");
    this.spiral.push("M -0.7813 0 C -0.7867 -0.4314 -0.4401 -0.7914 0 -0.7969");
    this.spiral.push("M 0 -0.7969 C 0.4401 -0.8024 0.807 -0.4487 0.8125 0");
    this.spiral.push("M 0.8125 0 C 0.818 0.4487 0.4573 0.8226 0 0.8281");
    this.spiral.push("M 0 0.8281 C -0.4573 0.8336 -0.8383 0.4659 -0.8438 0");
    this.spiral.push("M -0.8438 0 C -0.8492 -0.4659 -0.4746 -0.8539 0 -0.8594");
    this.spiral.push("M 0 -0.8594 C 0.4746 -0.8649 0.8695 -0.4832 0.875 0");
    this.spiral.push("M 0.875 0 C 0.8805 0.4832 0.4919 0.8851 0 0.8906");
    this.spiral.push("M 0 0.8906 C -0.4919 0.8961 -0.9008 0.5005 -0.9063 0");
    this.spiral.push("M -0.9063 0 C -0.9117 -0.5005 -0.5091 -0.9164 0 -0.9219");
    this.spiral.push("M 0 -0.9219 C 0.5091 -0.9274 0.932 -0.5178 0.9375 0");
    this.spiral.push("M 0.9375 0 C 0.943 0.5178 0.5264 0.9476 0 0.9531");
    this.spiral.push("M 0 0.9531 C -0.5264 0.9586 -0.9633 0.535 -0.9688 0");
    this.spiral.push("M -0.9688 0 C -0.9742 -0.535 -0.5436 -0.9789 0 -0.9844");
    this.spiral.push("M 0 -0.9844 C 0.5436 -0.9899 0.9945 -0.5523 1 0");
    this.spiral.push("M 1 0 C 1.0055 0.5523 0.5609 1.0101 0 1.0156");
    this.spiral.push("M 0 1.0156 C -0.5609 1.0211 -1.0257 0.5695 -1.0313 0");
    this.spiral.push("M -1.0313 0 C -1.0368 -0.5695 -0.5781 -1.0414 0 -1.0469");
    this.spiral.push("M 0 -1.0469 C 0.5781 -1.0524 1.057 -0.5867 1.0625 0");
    this.spiral.push("M 1.0625 0 C 1.068 0.5867 0.5954 1.0726 0 1.0781");
    this.spiral.push("M 0 1.0781 C -0.5954 1.0836 -1.0882 0.6041 -1.0938 0");
    this.spiral.push("M -1.0938 0 C -1.0993 -0.6041 -0.6127 -1.1039 0 -1.1094");
    this.spiral.push("M 0 -1.1094 C 0.6127 -1.1149 1.1195 -0.6213 1.125 0");
    this.spiral.push("M 1.125 0 C 1.1305 0.6213 0.6299 1.1351 0 1.1406");
    this.spiral.push("M 0 1.1406 C -0.6299 1.1461 -1.1507 0.6386 -1.1563 0");
    this.spiral.push("M -1.1563 0 C -1.1618 -0.6386 -0.6472 -1.1664 0 -1.1719");
    this.spiral.push("M 0 -1.1719 C 0.6472 -1.1774 1.182 -0.6558 1.1875 0");
    this.spiral.push("M 1.1875 0 C 1.193 0.6558 0.6644 1.1976 0 1.2031");
    this.spiral.push("M 0 1.2031 C -0.6644 1.2086 -1.2132 0.6731 -1.2188 0");
    this.spiral.push("M -1.2188 0 C -1.2243 -0.6731 -0.6817 -1.2289 0 -1.2344");
    this.spiral.push("M 0 -1.2344 C 0.6817 -1.2399 1.2445 -0.6903 1.25 0");
    this.spiral.push("M 1.25 0 C 1.2555 0.6903 0.6989 1.2601 0 1.2656");
    this.spiral.push("M 0 1.2656 C -0.6989 1.2711 -1.2757 0.7076 -1.2813 0");
    this.spiral.push("M -1.2813 0 C -1.2868 -0.7076 -0.7163 -1.2914 0 -1.2969");
    this.spiral.push("M 0 -1.2969 C 0.7163 -1.3024 1.307 -0.7249 1.3125 0");
    this.spiral.push("M 1.3125 0 C 1.318 0.7249 0.7335 1.3226 0 1.3281");
    this.spiral.push("M 0 1.3281 C -0.7335 1.3336 -1.3382 0.7421 -1.3438 0");
    this.spiral.push("M -1.3438 0 C -1.3493 -0.7421 -0.7508 -1.3539 0 -1.3594");
    this.spiral.push("M 0 -1.3594 C 0.7508 -1.3649 1.3695 -0.7594 1.375 0");
    this.spiral.push("M 1.375 0 C 1.3805 0.7594 0.768 1.3851 0 1.3906");
    this.spiral.push("M 0 1.3906 C -0.768 1.3961 -1.4007 0.7766 -1.4063 0");
    this.spiral.push("M -1.4063 0 C -1.4118 -0.7766 -0.7853 -1.4164 0 -1.4219");
    this.spiral.push("M 0 -1.4219 C 0.7853 -1.4274 1.432 -0.7939 1.4375 0");
    this.spiral.push("M 1.4375 0 C 1.443 0.7939 0.8025 1.4476 0 1.4531");
    this.spiral.push("M 0 1.4531 C -0.8025 1.4586 -1.4632 0.8111 -1.4688 0");
    this.spiral.push("M -1.4688 0 C -1.4743 -0.8111 -0.8197 -1.4789 0 -1.4844");
    this.spiral.push("M 0 -1.4844 C 0.8197 -1.4899 1.4945 -0.8284 1.5 0");
    this.spiral.push("M 1.5 0 C 1.5055 0.8284 0.8371 1.5101 0 1.5156");
    this.spiral.push("M 0 1.5156 C -0.8371 1.5211 -1.5257 0.8457 -1.5313 0");
    this.spiral.push("M -1.5313 0 C -1.5368 -0.8457 -0.8543 -1.5414 0 -1.5469");
    this.spiral.push(
      "M 0 -1.5469 C 0.4103 -1.5495 0.8059 -1.389 1.0993 -1.0993"
    );
    this.setComplet();
  },
  computed: {
    positionElement() {
      return {
        position: "absolute",
        top: this.topPosition + "px",
        left: this.leftPosition + "px",
      };
    },
    path() {
      return {
        "z-index": -1,
      };
    },
    path2() {
      return {
        "z-index": 0,
      };
    },
    ...mapGetters({
      completion: "getCompletionByDecade",
    }),
    ...mapState(["completionData"]),
  },
};
</script>

<style></style>
