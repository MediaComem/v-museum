<template>
  <rectangle
    :x="x"
    :y="y"
    :width="rectangleWidth"
    :height="rectangleHeight"
    :offsetX="windowWidth"
    :offsetY="windowHeight"
    @mousewheel="wheelMove"
    style="cursor: pointer; user-select:none;"
    ref="rectangle"
  />
  <div
    style="cursor: grab; user-select:none; width: 5000px; height: 2500px"
    @mousewheel="wheelMove"
    ref="display"
  >
    <el-row :gutter="10">
      <el-col :span="24">
        <span style="height: 500px; display: block" />
      </el-col>
    </el-row>
    <el-row :align="'bottom'">
      <el-col :span="6"><span style="height: 500px; display: block" /> </el-col>
      <el-col :span="3" :justify="'center'">
        <div ref="position1" :style="getImageWidth">
          <related-image
            :image="getRelatedPositionItem(1)"
            :imageHeight="200"
            :imageWidth="300"
            :align="'bottom'"
            :justify="'end'"
          /></div
      ></el-col>
      <el-col :span="2"> </el-col>
      <el-col :span="2"> </el-col>
      <el-col :span="2">
        <div ref="position2" :style="getImageWidth">
          <related-image
            :image="getRelatedPositionItem(2)"
            :imageHeight="200"
            :imageWidth="300"
            :align="'bottom'"
            :justify="'start'"
          />
        </div>
      </el-col>
      <el-col :span="5"> </el-col>
    </el-row>
    <el-row>
      <el-col :span="7"></el-col>
      <el-col :span="2"> </el-col>
      <el-col :span="6" :align="'bottom'">
        <el-row>
          <el-col :span="10">
            <el-row>
              <el-col :span="5">
                <p>333</p>
              </el-col>
              <el-col :span="5">
                <p class="year-font">1910's</p>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="2">
            <el-row :justify="'end'">
              <p
                v-if="relatedImagesPosition.length >= 1 && step === 3"
                class="index-font data-information"
                :class="{
                  removeRelatedImageBaseText: relatedImagesPosition[0].display,
                }"
              >
                {{ relatedImagesPosition[0].image.tag["@value"] }} &nbsp;
              </p>
              <p
                v-if="relatedImagesPosition.length >= 2 && step === 3"
                class="index-font data-information"
                :class="{
                  removeRelatedImageBaseText: relatedImagesPosition[1].display,
                }"
              >
                {{ relatedImagesPosition[1].image.tag["@value"] }} &nbsp;
              </p>
              <p
                v-if="relatedImagesPosition.length >= 3 && step === 3"
                class="index-font data-information"
                :class="{
                  removeRelatedImageBaseText: relatedImagesPosition[2].display,
                }"
              >
                {{ relatedImagesPosition[2].image.tag["@value"] }} &nbsp;
              </p>
              <p class="index-font data-information">
                {{ currentIndex + 1 }}
              </p>
            </el-row>
          </el-col>
          <el-col :span="11"> </el-col>
        </el-row>
      </el-col>
      <el-col :span="2"> </el-col>
      <el-col :span="7"> </el-col>
    </el-row>
    <el-row :gutter="10" :align="'middle'">
      <el-col :span="6"> <span style="height: 500px; display: block"/></el-col>
      <el-col :span="3">
        <div ref="position3" :style="getImageWidth">
          <related-image
            :image="getRelatedPositionItem(3)"
            :imageHeight="200"
            :imageWidth="300"
            :align="'top'"
            :justify="'end'"
          /></div
      ></el-col>
      <el-col :span="2">
        <div class="sliderMask" ref="divCar" style="width: 300px">
          <el-carousel
            :indicator-position="'none'"
            :height="getCarouselSize"
            direction="vertical"
            :loop="false"
            :autoplay="false"
            ref="carousel"
            class="custom-carousel"
            :class="selectZoomAnimation"
            @change="changeImage"
          >
            <el-carousel-item v-for="(value, index) in data" :key="index">
              <img
                ref="image"
                style="object-fit: none"
                class="custom-image"
                :src="value.imagePaths.large"
                :alt="value.id"
              />
            </el-carousel-item>
          </el-carousel>
        </div>
      </el-col>
      <el-col :span="2">
        <el-row :justify="'center'" :align="'middle'">
          <el-slider
            v-if="carouselHover"
            class="cursor-pointer"
            ref="slider"
            vertical
            v-model="step"
            :height="windowHeight / 5 + 'px'"
            :max="6"
            :show-tooltip="false"
            @change="releaseSlider"
            @input="changeImage"
          >
          </el-slider>
        </el-row>
      </el-col>
      <el-col :span="2">
        <div ref="position4" :style="getImageWidth">
          <related-image
            :image="getRelatedPositionItem(4)"
            :imageHeight="200"
            :imageWidth="300"
            :align="'middle'"
            :justify="'start'"
          />
        </div>
      </el-col>
      <el-col :span="5"> </el-col>
    </el-row>
    <el-row>
      <el-col :span="7"> </el-col>
      <el-col :span="2"> </el-col>
      <el-col :span="6">
        <el-row>
          <p v-if="data" class="data-information">
            {{ data[currentIndex].author }} <br />
            {{ data[currentIndex].medium }}
          </p>
        </el-row>
      </el-col>
      <el-col :span="2"> </el-col>
      <el-col :span="7"> </el-col>
    </el-row>
    <el-row>
      <el-col :span="6"> </el-col>
      <el-col :span="3"
        ><div ref="position5" :style="getImageWidth">
          <related-image
            :image="getRelatedPositionItem(5)"
            :imageHeight="200"
            :imageWidth="300"
            :align="'top'"
            :justify="'end'"
          />
        </div>
      </el-col>
      <el-col :span="2"> </el-col>
      <el-col :span="2"></el-col>
      <el-col :span="2">
        <div ref="position6" :style="getImageWidth">
          <related-image
            :image="getRelatedPositionItem(6)"
            :imageHeight="200"
            :imageWidth="300"
            :align="'top'"
            :justify="'start'"
          />
        </div>
      </el-col>
      <el-col :span="5"></el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="24">
        <span style="height: 1000px; display: block" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { useWindowSize } from "vue-window-size";
import { mapState } from "vuex";
import RelatedImage from "./RelatedImage/RelatedImage.vue";
import Rectangle from "./Rectangle.vue";

export default {
  name: "ImageSelector",
  components: { RelatedImage, Rectangle },
  watch: {
    images: function(newImages) {
      this.data = newImages;
      this.totalCarouselIndex = this.data.length;
      if (this.isInitialLoad) {
        this.$nextTick(() => {
          this.carousel.setActiveItem(0);
          this.isInitialLoad = false;
          this.$store.dispatch("loadRelatedImages", {
            tags: this.data[this.currentIndex].tags,
            id: this.data[this.currentIndex].id,
          });
        });
      }
    },
    relatedImages: function(images) {
      this.displayRelatedImages(images);
    },
    relatedImagesPosition: {
      handler() {
        this.setupSize();
      },
      deep: true,
    },
  },
  data() {
    return {
      potentialPosition: [1, 2, 3, 4, 5, 6],
      relatedImagesPosition: [],
      displayRelatedImageTimeout: [],

      isInitialLoad: true,
      data: undefined,
      currentIndex: 0,
      releaseStep: -1,
      previousStep: 3,
      zoomingStep: 3,
      step: 3,

      windowHeight: undefined,
      windowWidth: undefined,
      carousel: undefined,
      totalCarouselIndex: 0,
      currentSlide: 0,

      changeImageTimeout: undefined,

      isDrag: false,
      blockDrag: false,

      x: 200,
      y: 200,
      rectangleWidth: 0,
      rectangleHeight: 0,
      shouldUpdateDisplay: false,

      currentXPosition: 0,
      currentYPosition: 0,

      rectangleXPosition: 10,
      rectangleYPosition: 10,

      moveToImageTimeout: [],
      carouselHover: true,
    };
  },
  methods: {
    checkPosition(x, y, rectangle) {
      if (
        x < rectangle.x + rectangle.width &&
        x + this.rectangleWidth > rectangle.x &&
        y < rectangle.y + rectangle.height &&
        this.rectangleHeight + y > rectangle.y
      ) {
        this.moveToImageTimeout.push(
          setTimeout(() => {
            const newX =
              this.$refs.display.getBoundingClientRect().x -
              (rectangle.x - (this.windowWidth - rectangle.width) / 2);
            const newY =
              this.$refs.display.getBoundingClientRect().y -
              (rectangle.y - (this.windowHeight - rectangle.height) / 2);
            window.scrollTo({ left: -newX, top: -newY, behavior: "smooth" });
          }, 200)
        );
        return true;
      }
      return false;
    },
    checkCollision() {
      this.moveToImageTimeout.forEach(clearTimeout);
      this.moveToImageTimeout = [];
      const rectangle = this.$refs.divCar.getBoundingClientRect();
      const x = (this.windowWidth - this.$refs.divCar.clientWidth + 20) / 2;
      const y = (this.windowHeight - this.$refs.divCar.clientHeight + 20) / 2;
      this.carouselHover = this.checkPosition(x, y, rectangle);
      this.relatedImagesPosition.forEach((rectangle) => {
        this.checkPosition(
          x,
          y,
          this.$refs["position" + rectangle.position].getBoundingClientRect()
        )
          ? (rectangle.hover = true)
          : (rectangle.hover = false);
      });
      if (this.moveToImageTimeout.length === 0) {
        this.rectangleHeight = this.$refs.divCar.clientHeight + 20;
      } else {
        if (this.carouselHover) {
          this.rectangleHeight = this.$refs.divCar.clientHeight + 20;
        } else {
          this.rectangleHeight = this.$refs.divCar.clientHeight * 2 + 20;
        }
      }
    },
    startPosition() {
      this.isDrag = true;
    },
    endPosition() {
      this.isDrag = false;
    },
    wheelMove() {
      this.checkCollision();
    },
    mouseMove(event) {
      if (this.isDrag && !this.blockDrag) {
        const xMovement = this.currentXPosition - event.movementX;
        if (xMovement > 0 || xMovement < event.pageWidth) {
          this.currentXPosition = xMovement;
        }

        const yMovement = this.currentYPosition - event.movementY;
        if (yMovement > 0 || yMovement < event.pageHeight) {
          this.currentYPosition = yMovement;
        }

        this.rectangleXPosition =
          -this.$refs.display.getBoundingClientRect().left +
          this.windowWidth / 2 -
          this.rectangleWidth / 2;
        this.rectangleYPosition =
          -this.$refs.display.getBoundingClientRect().top +
          this.windowHeight / 2 -
          this.rectangleHeight / 2;
        window.scrollTo(this.currentXPosition, this.currentYPosition);
        this.checkCollision();
      }
    },
    // This method reset some properties in case of the user release the slider
    releaseSlider(releaseStep) {
      this.blockDrag = false;
      this.zoomingStep = 2;
      this.releaseStep = releaseStep;
      this.step = 3;
      this.stopChangeImageTimeout();
      this.$store.dispatch("loadRelatedImages", {
        tags: this.data[this.currentIndex].tags,
        id: this.data[this.currentIndex].id,
      });
    },
    animationStepAnalysis(move, faster, slower) {
      if (move) {
        if (faster) {
          this.releaseStep = -1;
          this.zoomingStep = 2;
        } else if (slower) {
          this.zoomingStep = 1;
        }
      }
    },
    changeImage(nextImageIndex) {
      this.blockDrag = true;
      // In case of we move to top for animation analysis purpose
      const forward = this.step < 3;
      let slower = this.step - this.previousStep >= 1;
      let faster = this.step - this.previousStep <= -1;
      this.animationStepAnalysis(forward, faster, slower);

      // In case of we move to bottom for animation analysis purpose
      const backward = this.step > 3;
      faster = this.step - this.previousStep >= 1;
      slower = this.step - this.previousStep <= -1;
      this.animationStepAnalysis(backward, faster, slower);

      // Stop loading of related images
      this.stopDisplayRelatedImages();

      // Moving carousel part
      switch (this.step) {
        case 0:
          this.navigateNextImage(nextImageIndex, 80, 50);
          break;
        case 1:
          this.navigateNextImage(nextImageIndex, 40, 250);
          break;
        case 2:
          this.navigateNextImage(nextImageIndex, 20, 1000);
          break;
        case 3:
          this.stopChangeImageTimeout();
          break;
        case 4:
          this.navigatePreviousImage(1000);
          break;
        case 5:
          this.navigatePreviousImage(250);
          break;
        case 6:
          this.navigatePreviousImage(50);
          break;
      }
      // Keep track of this step for animation analysis purpose
      this.previousStep = this.step;
    },
    navigatePreviousImage(intervalTransitionTime) {
      if (this.currentIndex > 0) {
        this.stopChangeImageTimeout();
        this.changeImageTimeout = setTimeout(() => {
          this.carousel.prev();
          this.currentIndex = this.currentIndex - 1;
        }, intervalTransitionTime);
      }
    },
    navigateNextImage(
      nextImageIndex,
      diffMaxIndexBeforeLoad,
      intervalTransitionTime
    ) {
      this.currentSlide = nextImageIndex;
      if (
        nextImageIndex > this.totalCarouselIndex - diffMaxIndexBeforeLoad &&
        !this.isLoadingImage
      ) {
        this.$store.dispatch("loadNextContent");
      }
      if (this.currentIndex < this.totalCarouselIndex - 1) {
        this.stopChangeImageTimeout();
        this.changeImageTimeout = setTimeout(() => {
          this.carousel.next();
          this.currentIndex = this.currentIndex + 1;
        }, intervalTransitionTime);
      }
    },
    stopChangeImageTimeout() {
      clearTimeout(this.changeImageTimeout);
    },
    stopDisplayRelatedImages() {
      this.relatedImagesPosition = [];
      this.displayRelatedImageTimeout.forEach(clearTimeout);
      this.displayRelatedImageTimeout = [];
    },
    getRelatedPositionItem(position) {
      return this.relatedImagesPosition.filter((e) => e.position === position);
    },
    displayRelatedImages(images) {
      // Select randomly 3 display positions
      this.potentialPosition
        .sort(() => Math.random() - 0.5)
        .slice(0, images.length)
        .forEach((position, index) => {
          this.relatedImagesPosition.push({
            position: position,
            image: images[index],
            display: false,
            hover: false,
          });
        });

      // Setup the display animation
      this.$nextTick(() => {
        this.relatedImagesPosition.forEach((element, index) => {
          const animationDelay = 1000 + 2000 * index;
          this.displayRelatedImageTimeout.push(
            setTimeout(() => {
              this.relatedImagesPosition[index].display = true;
              this.$nextTick(() => {
                this.shouldUpdateDisplay = true;
                this.setupSize(this.relatedImagesPosition[index].position);
              });
            }, animationDelay)
          );
        });
      });
    },
    setupSize() {
      if (this.shouldUpdateDisplay) {
        const rectangle = this.$refs.divCar.getBoundingClientRect();
        const newX =
          this.$refs.display.getBoundingClientRect().x -
          (rectangle.x - (this.windowWidth - rectangle.width) / 2);
        const newY =
          this.$refs.display.getBoundingClientRect().y -
          (rectangle.y - (this.windowHeight - rectangle.height) / 2);
        window.scrollTo({ left: -newX, top: -newY });
        this.rectangleXPosition =
          -newX + (this.windowWidth - rectangle.width) / 2 - 10;
        this.rectangleYPosition =
          -newY + (this.windowHeight - rectangle.height) / 2 - 10;
        this.shouldUpdateDisplay = false;
      }
    },
  },
  computed: {
    getCarouselSize() {
      return this.carouselHover ? "400px" : "200px";
    },
    getImageWidth() {
      return {
        width: '300px',
      }
    },
    selectZoomAnimation() {
      return {
        zoomTransitionImageFast:
          (this.step === 0 || this.step === 6) && this.zoomingStep === 2,
        zoomTransitionImageMedium:
          (this.step === 1 || this.step === 5) && this.zoomingStep === 2,
        zoomTransitionImageSlow:
          (this.step === 2 || this.step === 4) &&
          (this.zoomingStep === 2 || this.zoomingStep === 1),
        unzoomTransitionImageFastEnd:
          this.step === 3 && (this.releaseStep === 0 || this.releaseStep === 6),
        unzoomTransitionImageFast:
          (this.step === 1 || this.step === 5) && this.zoomingStep === 1,
      };
    },
    ...mapState(["images", "isLoadingImage", "relatedImages"]),
  },
  mounted() {
    // Due to the mandatory height for carousel element in vertical mode.
    // This lib is used for reponsive purpose
    const { width, height } = useWindowSize();
    this.windowHeight = height;
    this.windowWidth = width;

    this.carousel = this.$refs.carousel;

    this.x = this.$refs.divCar.getBoundingClientRect().left;
    this.y = this.$refs.divCar.getBoundingClientRect().top;
    this.currentXPosition = this.$refs.divCar.getBoundingClientRect().left;
    this.currentYPosition = this.$refs.divCar.getBoundingClientRect().top;
    this.rectangleHeight = this.$refs.divCar.clientHeight + 20;
    this.rectangleWidth = this.$refs.divCar.clientWidth + 20;

    this.rectangleXPosition = this.currentXPosition - 10;
    this.rectangleYPosition = this.currentYPosition - 10;

    // The parameter for the year search will come from the previous selection view.
    // Currently, this value is hard-coded for testing purpose.
    this.$store.dispatch("initializeCarousel", {
      decade: "191",
    });
  },
};
</script>

<style scoped>
@import "./imageselector.css";
@import "./carouselAnimation.css";
@import "./relatedImageAnimation.css";

.cursor-grab {
  cursor: grab;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
