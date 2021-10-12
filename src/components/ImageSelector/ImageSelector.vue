<template>
  <!-- History Part-->
  <history
    :topPosition="windowHeight - 63"
    :leftPosition="10"
    :fullWidth="windowWidth"
    :displayAllHistory="fullHistoryMode"
    :couldLoadHistory="couldLoadHistory"
    @openFullHistory="fullHistoryMode = true"
    @closeFullHistory="fullHistoryMode = false"
  />
  <div
    :style="setPage"
    @mousewheel="mouseWheel"
    @mousedown="startPosition"
    @mouseup="endPosition"
    @mouseleave="endPosition"
    @mousemove="mouseMove"
    @touchstart="startPosition"
    @touchend="endPosition"
    @touchmove="touchMove"
    ref="display"
    style="touch-action: pan-x pan-y;"
  >
    <!-- Target display part -->
    <rectangle
      :width="rectangleWidth"
      :height="rectangleHeight"
      :offsetX="windowWidth"
      :offsetY="windowHeight"
      ref="rectangle"
    />

    <!-- Related Image display part -->
    <div
      :style="relatedImagePosition1"
      v-if="relatedImagesPosition.length > 0"
      style="z-index: -1"
    >
      <div
        v-if="secondRelatedImagesPosition.length === 0"
        ref="position0"
        class="loading"
        :style="relatedImageDisplay1"
        style="background-color: lightgray"
      >
        <div class="loader" v-if="!relatedImagesPosition[0].image">
          <div class="loader-wheel"></div>
        </div>
      </div>
    </div>
    <div
      :style="relatedImagePosition1"
      v-if="relatedImagesPosition.length > 0 && relatedImagesPosition[0].image"
      :class="{
        removeRelatedImageBase:
          secondRelatedImagesPosition.length > 0 &&
          !relatedImagesPosition[0].isTarget,
      }"
    >
      <div ref="position0" :style="relatedImageDisplay1">
        <related-image
          @click="
            loadFocusImage(
              relatedImagesPosition[0].image.result.id,
              relatedImagesPosition[0].image.result
            )
          "
          :image="relatedImagesPosition[0]"
          :runTransition="carouselHover"
          :isTransitionExecuted="shouldRunRelatedImageTransition"
        />
      </div>
    </div>
    <div
      :style="relatedImagePosition2"
      v-if="relatedImagesPosition.length > 1"
      style="z-index: -1"
    >
      <div
        v-if="secondRelatedImagesPosition.length === 0"
        ref="position1"
        class="loading"
        :style="relatedImageDisplay2"
        style="background-color: lightgray"
      >
        <div class="loader" v-if="!relatedImagesPosition[1].image">
          <div class="loader-wheel"></div>
        </div>
      </div>
    </div>
    <div
      :style="relatedImagePosition2"
      v-if="relatedImagesPosition.length > 1 && relatedImagesPosition[1].image"
      :class="{
        removeRelatedImageBase:
          secondRelatedImagesPosition.length > 0 &&
          !relatedImagesPosition[1].isTarget,
      }"
    >
      <div ref="position1" :style="relatedImageDisplay2">
        <related-image
          @click="
            loadFocusImage(
              relatedImagesPosition[0].image.result.id,
              relatedImagesPosition[1].image.result
            )
          "
          :image="relatedImagesPosition[1]"
          :runTransition="carouselHover"
          :isTransitionExecuted="shouldRunRelatedImageTransition"
        />
      </div>
    </div>
    <div
      :style="relatedImagePosition3"
      v-if="relatedImagesPosition.length > 2"
      style="z-index: -1"
    >
      <div
        v-if="secondRelatedImagesPosition.length === 0"
        ref="position2"
        class="loading"
        :style="relatedImageDisplay3"
        style="background-color: lightgray"
      >
        <div class="loader" v-if="!relatedImagesPosition[2].image">
          <div class="loader-wheel"></div>
        </div>
      </div>
    </div>
    <div
      :style="relatedImagePosition3"
      v-if="relatedImagesPosition.length > 2 && relatedImagesPosition[2].image"
      :class="{
        removeRelatedImageBase:
          secondRelatedImagesPosition.length > 0 &&
          !relatedImagesPosition[2].isTarget,
      }"
    >
      <div ref="position2" :style="relatedImageDisplay3">
        <related-image
          @click="
            loadFocusImage(
              relatedImagesPosition[0].image.result.id,
              relatedImagesPosition[2].image.result
            )
          "
          :image="relatedImagesPosition[2]"
          :runTransition="carouselHover"
          :isTransitionExecuted="shouldRunRelatedImageTransition"
        />
      </div>
    </div>
    <!-- Related image text display -->
    <div
      v-if="
        relatedImagesPosition.length > 0 && relatedImagesPosition[0].display
      "
      :style="relatedInformationPosition1"
      :class="{
        removeRelatedImageBase: secondRelatedImagesPosition.length > 0,
      }"
    >
      <p
        class="related-text"
        v-if="!relatedImagesPosition[0].hover && relatedImagesPosition[0].image"
        :class="{
          relatedImageBase:
            !endDisplay && carouselHover && !shouldRunRelatedImageTransition,
        }"
      >
        {{ relatedImagesPosition[0].image.tag["@value"] }}
      </p>
      <div
        v-if="relatedImagesPosition[0].hover && relatedImagesPosition[0].image"
      >
        <div class="illustration">
          <p
            style="margin-bottom: 0; margin-top: 20px; font-weight: normal;"
            class="font-size-information"
          >
            Illustration: &nbsp;
          </p>
          <p
            style="margin-bottom: 0; margin-top: 20px; overflow: hidden; color: gray; white-space: nowrap"
            class="font-size-information"
          >
            {{ relatedImagesPosition[0].image.result.author }}
          </p>
        </div>
        <div class="story story-related">
          <p
            style="margin: 0; font-weight: normal;"
            class="font-size-information"
          >
            Story: &nbsp;
          </p>
          <p
            style="margin: 0; overflow: hidden; color: gray; white-space: nowrap;"
            class="font-size-information"
          >
            {{ relatedImagesPosition[0].image.result.title }}
          </p>
        </div>
      </div>
    </div>
    <div
      v-if="
        relatedImagesPosition.length > 1 && relatedImagesPosition[1].display
      "
      :style="relatedInformationPosition2"
      :class="{
        removeRelatedImageBase: secondRelatedImagesPosition.length > 0,
      }"
    >
      <p
        class="related-text"
        v-if="!relatedImagesPosition[1].hover && relatedImagesPosition[1].image"
        :class="{
          relatedImageBase:
            !endDisplay && carouselHover && !shouldRunRelatedImageTransition,
        }"
      >
        {{ relatedImagesPosition[1].image.tag["@value"] }}
      </p>
      <div
        v-if="relatedImagesPosition[1].hover && relatedImagesPosition[0].image"
      >
        <div class="illustration">
          <p
            style="margin-bottom: 0; margin-top: 20px; font-weight: normal;"
            class="font-size-information"
          >
            Illustration: &nbsp;
          </p>
          <p
            style="margin-bottom: 0; margin-top: 20px; overflow: hidden; color: gray; white-space: nowrap"
            class="font-size-information"
          >
            {{ relatedImagesPosition[1].image.result.author }}
          </p>
        </div>
        <div class="story story-related">
          <p
            style="margin: 0; font-weight: normal;"
            class="font-size-information"
          >
            Story: &nbsp;
          </p>
          <p
            style="margin: 0; overflow: hidden; color: gray; white-space: nowrap;"
            class="font-size-information"
          >
            {{ relatedImagesPosition[1].image.result.title }}
          </p>
        </div>
      </div>
    </div>
    <div
      v-if="
        relatedImagesPosition.length > 2 && relatedImagesPosition[2].display
      "
      :style="relatedInformationPosition3"
      :class="{
        removeRelatedImageBase: secondRelatedImagesPosition.length > 0,
      }"
    >
      <p
        class="related-text"
        v-if="!relatedImagesPosition[2].hover && relatedImagesPosition[2].image"
        :class="{
          relatedImageBase:
            !endDisplay && carouselHover && !shouldRunRelatedImageTransition,
        }"
      >
        {{ relatedImagesPosition[2].image.tag["@value"] }}
      </p>
      <div
        v-if="relatedImagesPosition[2].hover && relatedImagesPosition[0].image"
      >
        <div class="illustration">
          <p
            style="margin-bottom: 0; margin-top: 20px; font-weight: normal;"
            class="font-size-information"
          >
            Illustration: &nbsp;
          </p>
          <p
            style="margin-bottom: 0; margin-top: 20px; overflow: hidden; color: gray; white-space: nowrap"
            class="font-size-information"
          >
            {{ relatedImagesPosition[2].image.result.author }}
          </p>
        </div>
        <div class="story story-related">
          <p
            style="margin: 0; font-weight: normal;"
            class="font-size-information"
          >
            Story: &nbsp;
          </p>
          <p
            style="margin: 0; overflow: hidden; color: gray; white-space: nowrap;"
            class="font-size-information"
          >
            {{ relatedImagesPosition[2].image.result.title }}
          </p>
        </div>
      </div>
    </div>
    <!-- Image information top part -->
    <div
      v-if="carouselHover && relatedImagesPosition.length > 0 && !endDisplay"
      :style="imageInformationPositionTag"
    >
      <div
        style="overflow: hidden;"
        :style="{ width: thumbnailWidth() + 20 + 'px' }"
      >
        <p
          v-if="
            relatedImagesPosition.length > 0 && relatedImagesPosition[0].image
          "
          class="image-information"
          :class="{
            removeRelatedImageBaseText:
              relatedImagesPosition[0].display &&
              !shouldRunRelatedImageTransition,
          }"
        >
          {{ relatedImagesPosition[0].image.tag["@value"] }} &nbsp;
        </p>
        <p
          v-if="
            relatedImagesPosition.length > 1 && relatedImagesPosition[1].image
          "
          class="image-information"
          :class="{
            removeRelatedImageBaseText:
              relatedImagesPosition[1].display &&
              !shouldRunRelatedImageTransition,
          }"
        >
          {{ relatedImagesPosition[1].image.tag["@value"] }} &nbsp;
        </p>
        <p
          v-if="
            relatedImagesPosition.length > 2 && relatedImagesPosition[2].image
          "
          class="image-information"
          :class="{
            removeRelatedImageBaseText:
              relatedImagesPosition[2].display &&
              !shouldRunRelatedImageTransition,
          }"
        >
          {{ relatedImagesPosition[2].image.tag["@value"] }} &nbsp;
        </p>
      </div>
    </div>
    <div v-if="carouselHover && endDisplay" :style="imageInformationPosition">
      <completion
        :decade="currentDecade"
        :height="completionSize"
        :width="completionSize"
        :topPosition="topCompletioPosition"
        :leftPosition="-20"
        :emptyColor="'lightgray'"
        :completeColor="'black'"
      />
      <div @click="loadOnboarding()" style="z-index: 1;">
        <p class="return-position">
          {{ currentDecade + "0" }}
          <img src="@/assets/image-selector/vector.png" />
          &nbsp;
        </p>
      </div>
    </div>
    <div v-if="carouselHover && endDisplay" :style="indexInformationPosition">
      <h3 style="margin: 0;" class="index-text-font">
        {{ currentIndex + 1 }}
      </h3>
    </div>
    <!-- Carousel display part -->
    <div
      :style="imagePosition"
      :class="{
        removeRelatedImageBase: secondRelatedImagesPosition.length > 0,
      }"
    >
      <div v-show="viewerImageMode" :style="componentSize">
        <div ref="divCar" :style="imageViewerDisplay">
          <img
            v-if="data && data[currentIndex]"
            draggable="false"
            class="carousel-image"
            :src="data[currentIndex].imagePaths.large"
            :alt="data[currentIndex].id"
            @click="loadFocusImage(data[currentIndex].id)"
          />
        </div>
      </div>
      <div
        v-show="!viewerImageMode"
        :style="componentSize"
        style="overflow:hidden;"
        class="sliderMask"
      >
        <div :style="componentSize" :class="selectZoomAnimation">
          <ul
            class="ul-image"
            ref="ul-image"
            :class="selectSliderTransitionSpeed"
            :style="[scrollingDisplay, scrollingMovement]"
          >
            <li
              v-for="(value, index) in data"
              :key="index"
              :style="componentSize"
              :ref="'li-' + index"
            >
              <div :style="componentSize" style="overflow:hidden">
                <img
                  v-if="value && value.imagePaths"
                  class="carousel-image"
                  :ref="'image-' + index"
                  :src="value.imagePaths.large"
                  :alt="value.id"
                />
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- Image information bottom part -->
    <div v-if="data && data[currentIndex] && carouselHover">
      <div :style="imageCreatorPosition" class="illustration">
        <p
          style="margin-bottom: 0; margin-top: 20px; font-weight: normal;"
          class="font-size-information"
        >
          Illustration: &nbsp;
        </p>
        <p
          style="margin-bottom: 0; margin-top: 20px; overflow: hidden; color: gray; white-space: nowrap"
          class="font-size-information"
        >
          {{ data[currentIndex].author }}
        </p>
      </div>
      <div :style="imageStoryPosition" class="story">
        <p
          style="margin: 0; font-weight: normal;"
          class="font-size-information"
        >
          Story: &nbsp;
        </p>
        <p
          style="margin: 0; overflow: hidden; color: gray; white-space: nowrap;"
          class="font-size-information"
        >
          {{ data[currentIndex].title }}
        </p>
      </div>
    </div>
    <!-- Slider Part -->
    <div
      v-show="carouselHover"
      class="font-slider"
      :style="fontSliderPosition"
    ></div>
    <div
      :style="sliderPosition"
      @mouseover="blockDrag = true"
      @mouseleave="blockDrag = false"
      @dragover="blockDrag = true"
      @dragleave="blockDrag = false"
      @touchstart="blockDrag = true"
      @touchend="blockDrag = false"
    >
      <el-slider
        v-show="carouselHover"
        :class="selectArrayDisplay"
        style="width: 42px"
        ref="slider"
        vertical
        v-model="step"
        :height="'240px'"
        :max="600"
        :show-tooltip="false"
        @input="sliderChange"
        @change="releaseSlider"
      >
      </el-slider>
    </div>
    <!-- Second related Images -->
    <div
      :style="secondRelatedImagePosition1"
      v-if="secondRelatedImagesPosition.length > 0"
    >
      <div :style="secondRelatedImageDisplay1">
        <related-image
          :image="secondRelatedImagesPosition[0]"
          :runTransition="true"
          :isTransitionExecuted="false"
        />
      </div>
    </div>
    <div
      :style="secondRelatedImagePosition2"
      v-if="secondRelatedImagesPosition.length > 1"
    >
      <div :style="secondRelatedImageDisplay2">
        <related-image
          :image="secondRelatedImagesPosition[1]"
          :runTransition="true"
          :isTransitionExecuted="false"
        />
      </div>
    </div>
    <div
      :style="secondRelatedImagePosition3"
      v-if="secondRelatedImagesPosition.length > 2"
    >
      <div :style="secondRelatedImageDisplay3">
        <related-image
          :image="secondRelatedImagesPosition[2]"
          :runTransition="true"
          :isTransitionExecuted="false"
        />
      </div>
    </div>
  </div>
  <!-- Second related images information -->
  <div
    v-if="secondRelatedTagsElements.length > 0 && relatedOver"
    :style="secondImageInformationPosition"
  >
    <div
      style="display: flex; overflow: hidden;"
      :style="{ width: thumbnailWidth() + 'px' }"
    >
      <p
        v-if="secondRelatedTagsElements.length > 0"
        class="image-information"
        :class="{
          removeRelatedImageBaseText:
            secondRelatedImagesPosition.length > 0 &&
            secondRelatedImagesPosition[0].display,
        }"
      >
        {{ secondRelatedTagsElements[0]["@value"] }} &nbsp;
      </p>
      <p
        v-if="secondRelatedTagsElements.length > 1"
        class="image-information"
        :class="{
          removeRelatedImageBaseText:
            secondRelatedImagesPosition.length > 1 &&
            secondRelatedImagesPosition[1].display,
        }"
      >
        {{ secondRelatedTagsElements[1]["@value"] }} &nbsp;
      </p>
      <p
        v-if="secondRelatedTagsElements.length > 2"
        class="image-information"
        :class="{
          removeRelatedImageBaseText:
            secondRelatedImagesPosition.length > 2 &&
            secondRelatedImagesPosition[2].display,
        }"
      >
        {{ secondRelatedTagsElements[2]["@value"] }} &nbsp;
      </p>
      <p v-if="shouldDisplayLoading" class="image-information loader-text">
        Loading
      </p>
    </div>
  </div>
  <div
    v-if="
      secondRelatedImagesPosition.length > 0 &&
        secondRelatedImagesPosition[0].display
    "
    :style="secondRelatedInformationPosition1"
  >
    <p class="related-text relatedImageBase">
      {{ secondRelatedImagesPosition[0].image.tag["@value"] }}
    </p>
  </div>
  <div
    v-if="
      secondRelatedImagesPosition.length > 1 &&
        secondRelatedImagesPosition[1].display
    "
    :style="secondRelatedInformationPosition2"
  >
    <p class="related-text relatedImageBase">
      {{ secondRelatedImagesPosition[1].image.tag["@value"] }}
    </p>
  </div>
  <div
    v-if="
      secondRelatedImagesPosition.length > 2 &&
        secondRelatedImagesPosition[2].display
    "
    :style="secondRelatedInformationPosition3"
  >
    <p class="related-text relatedImageBase">
      {{ secondRelatedImagesPosition[2].image.tag["@value"] }}
    </p>
  </div>
</template>

<script>
import { useWindowSize } from "vue-window-size";
import { mapState, mapGetters } from "vuex";

import Rectangle from "./Rectangle.vue";
import RelatedImage from "./RelatedImage/RelatedImage.vue";
import Completion from "../Completion/Completion.vue";
import History from "../History/History.vue";

export default {
  name: "ImageSelector",
  components: { Rectangle, RelatedImage, Completion, History },
  watch: {
    $route: function() {
      if (this.$route.name === "selector") {
        if (this.$route.query.history !== undefined) {
          this.stopDisplayRelatedImages();
          this.couldLoadHistory = false;
          // If the loading comes from history, setup the states
          this.nextDecade = this.$route.params.decade;
          this.currentDecade = this.$route.params.decade;
          this.data = this.getImagesByDecade(this.$route.params.decade);
          let index = -1;
          if (this.data) {
            this.data = this.data.data;
            index = this.data.findIndex((e) => {
              return e.id == this.$route.query.imageId;
            });
          }
          if (index === -1) {
            this.isInitialLoad = true;
            this.idToFind = this.$route.query.imageId;
            this.shouldFindIndex = true;
            this.loadDataWithSkipId(this.currentDecade, this.idToFind);
          } else {
            this.currentIndex = index;
            this.relatedImagesPosition = [];
            this.currentXPosition = this.defineLeftPositionCenterPage();
            this.currentYPosition = this.defineTopPositionCenterPage();
            this.carouselHover = true;
            this.rectangleHeight = this.thumbnailHeight() + 20;
            this.rectangleWidth = this.thumbnailWidth() + 20;
            this.shouldRunCentralImageTransition = false;
            window.scrollTo(this.currentXPosition, this.currentYPosition);
            this.couldLoadHistory = true;
            this.$store.dispatch("loadRelatedImages", {
              tags: this.data[this.currentIndex].tags,
              id: this.data[this.currentIndex].id,
            });
            this.setupPosition();
          }
        }
      }
    },
    // Watcher uses to manage new data in the store
    images: {
      handler() {
        const images = this.getImagesByDecade(this.currentDecade);
        // Set only when images are available and more important only if necessary
        if (images && this.couldLoad) {
          this.data = images.data;
        }

        if (this.shouldFindIndex) {
          this.currentIndex = this.data.findIndex((e) => {
            return e.id == this.idToFind;
          });
          this.shouldFindIndex = false;
        }

        if (this.isInitialLoad) {
          this.loadInitialData();
        }
      },
      deep: true,
    },
    currentIndex: function(newVal) {
      this.isBeginning = newVal === 0;
      this.isEnd = newVal === this.data.length - 1;
      this.shouldRunSideAnimation = this.isBeginning || this.isEnd;
      clearTimeout(this.historyTimeout);
      this.historyTimeout = undefined;
      this.endDisplay = true;
    },
    carouselHover: function(newVal) {
      if (!newVal) {
        this.displayRelatedImageTimeout.forEach(clearTimeout);
        this.displayRelatedImageTimeout = [];

        this.relatedImagesPosition.forEach((element, index) => {
          if (this.relatedImagesPosition[index]) {
            this.relatedImagesPosition[index].display = true;
            this.$nextTick(() => {
              this.shouldUpdateDisplay = true;
            });
          }
        });
        this.shouldRunRelatedImageTransition = true;
      }
    },
    relatedImages: function(images) {
      if (
        this.shouldLoadRelatedImage &&
        images[0] &&
        images[0].originalId == this.data[this.currentIndex].id
      ) {
        this.endDisplay = false;
        this.displayRelatedImages(images);
        // The animations take 8 seconds so store history only at the end.
        this.historyTimeout = setTimeout(() => {
          this.$store.dispatch("insertHistory", {
            decade: this.currentDecade,
            imageId: this.data[this.currentIndex].id,
            data: this.data[this.currentIndex].imagePaths.square,
          });
          this.endDisplay = true;
        }, 8000);
      }
    },
    // Watcher uses to manage the completion element
    currentDecade: function() {
      const completion = this.getCompletionByDecade(this.currentDecade);
      if (completion) {
        this.originalCompletion = +completion.completion;
        this.totalIndex = +completion.totalImages;
        this.maxVisitedIndex = +completion.maxVisitedIndex;
      }
    },
  },
  data() {
    return {
      // Data informations
      isBeginning: true,
      isEnd: false,
      currentDecade: "",
      nextDecade: "",
      data: undefined,
      totalIndex: 0,
      maxVisitedIndex: 0,
      originalCompletion: 0,
      completion: 0,
      endDisplay: true,
      couldLoad: true,
      nextId: 0,
      shouldFindIndex: false,
      idToFind: 0,
      // Information uses to manage the movement
      step: 300,
      speed: 6000,
      previousSpeed: 0,
      previousDirection: undefined,
      currentIndex: 0,
      currentXPosition: 0,
      currentYPosition: 0,
      isDrag: false,
      blockDrag: false,
      shouldStartRelatedImageSearch: false,
      shouldLoadRelatedImage: true,
      // Information uses to manage the animations
      zoomingStep: 3,
      nbImageMove: 0,
      shouldRunSideAnimation: false,
      shouldRunDecelerateAnimation: false,
      shouldRunCentralImageTransition: true,
      shouldRunRelatedImageTransition: true,
      endOfSlider: undefined,
      shouldDisplayLoading: true,
      // Information uses to manage the display
      pageHeight: 4000,
      pageWidth: 6000,
      windowHeight: undefined,
      windowWidth: undefined,
      // Management of the interval and timeout process
      interval: [],
      timeout: undefined,
      decelerateTimouts: [],
      // Target properties
      rectangleWidth: 0,
      rectangleHeight: 0,
      moveToImageTimeout: [],
      carouselHover: true,
      // Related images properties
      isInitialLoad: true,
      potentialPosition: [1, 2, 3, 4, 5, 6],
      relatedImagesPosition: [],
      secondRelatedImagesPosition: [],
      displayRelatedImageTimeout: [],
      viewerImageMode: false,
      newOriginX: 0,
      newOriginY: 0,
      secondRelatedImageTimeout: [],
      secondRelatedTagsElements: [],
      secondRelatedImageInterval: undefined,
      // History Part
      historyTimeout: undefined,
      fullHistoryMode: false,
      couldLoadHistory: true,
    };
  },
  methods: {
    async loadDataWithSkipId(decade, id) {
      this.$store.dispatch("insertSkipId", {
        decade: decade,
        id: id,
      });
      this.$store.dispatch("loadNextContent", {
        decade: decade,
        id: id,
      });
    },
    loadInitialData() {
      this.$nextTick(() => {
        const completion = this.getCompletionByDecade(this.currentDecade);
        if (completion) {
          this.originalCompletion = +completion.completion;
          this.totalIndex = +completion.totalImages;
          this.maxVisitedIndex = this.currentIndex;

          this.$store.dispatch("updateCompletion", {
            decade: this.currentDecade,
            completion: completion.completion,
            maxVisitedIndex: this.currentIndex,
          });
        }

        const currentRelatedImages = this.getRelatedImages();

        if (
          currentRelatedImages &&
          currentRelatedImages[0] &&
          currentRelatedImages[0].originalId === this.data[this.currentIndex].id
        ) {
          currentRelatedImages.forEach((image) => {
            this.relatedImagesPosition.push({
              position: image.position,
              image: image.result.images,
              display: false,
              hover: false,
              isTarget: false,
            });
          });
          this.displayRelatedImages(currentRelatedImages);
        } else {
          this.$store.dispatch("loadRelatedImages", {
            tags: this.data[this.currentIndex].tags,
            id: this.data[this.currentIndex].id,
          });
          this.setupPosition();
        }

        this.isInitialLoad = false;
        this.viewerImageMode = true;
        this.carouselHover = true;
        window.scrollTo(this.currentXPosition, this.currentYPosition);
      });
      this.couldLoadHistory = true;
    },
    loadOnboarding() {
      this.$store.dispatch("updateLastVisitedElement", {
        decade: this.currentDecade,
        index: this.currentIndex,
        imageId: this.data[this.currentIndex].id,
      });
      this.$router.push({
        path: `/`,
        query: { decade: this.decade },
      });
    },
    loadFocusImage(id, image) {
      if (!this.isDrag) {
        this.$store.dispatch("updateLastVisitedElement", {
          decade: this.currentDecade,
          index: this.currentIndex,
          imageId: this.data[this.currentIndex].id,
        });
        this.$router.push({
          path: `/image/${id}`,
          query: image
            ? { image: JSON.stringify(image) }
            : { image: JSON.stringify(this.data[this.currentIndex]) },
        });
      }
    },
    centerTarget(rectangle, relatedImage, isRelated, isHover) {
      if (isHover) {
        this.moveToImageTimeout.push(
          setTimeout(() => {
            const newX =
              this.$refs.display.getBoundingClientRect().x -
              (rectangle.x - (this.windowWidth - rectangle.width) / 2);
            const newY =
              this.$refs.display.getBoundingClientRect().y -
              (rectangle.y - (this.windowHeight - rectangle.height) / 2);
            this.currentXPosition = -newX;
            this.currentYPosition = -newY;
            window.scrollTo({ left: -newX, top: -newY, behavior: "smooth" });
            if (isRelated) {
              const positions = this.getRelatedImagePosition(
                relatedImage,
                this.defineLeftImagePosition(),
                this.defineTopImagePosition()
              );
              relatedImage.isTarget = true;
              this.newOriginY = positions[0];
              this.newOriginX = positions[1];
              this.secondRelatedTagsElements = this.getSecondRelatedTags(
                relatedImage.position
              );
              this.secondRelatedImageInterval = setInterval(() => {
                const relatedImages = this.getSecondRelatedImages(
                  relatedImage.image.result.id
                );
                if (relatedImages) {
                  this.shouldDisplayLoading = true;
                  clearInterval(this.secondRelatedImageInterval);
                  this.$router.push(
                    `/selector/${relatedImage.image.result.decade.slice(0, 3)}`
                  );
                  this.loadSecondRelatedImages(
                    relatedImage.image.result.decade.slice(0, 3),
                    relatedImage.image.result.id,
                    relatedImages.images
                  );
                  this.shouldDisplayLoading = false;
                }
              }, 100);
            }
          }, 200)
        );
      }
    },
    colision(top, left, isHover, isRelated) {
      if (
        !isHover &&
        !isRelated &&
        left <= 100 &&
        left >= -100 &&
        top <= 100 &&
        top >= -100
      ) {
        return true;
      } else if (
        isHover &&
        !isRelated &&
        left <=
          100 + (this.thumbnailWidth() - this.relatedThumbnailWidth()) / 4 &&
        left >=
          -100 - (this.thumbnailWidth() - this.relatedThumbnailWidth()) / 4 &&
        top <=
          100 + (this.thumbnailHeight() - this.relatedThumbnailHeight()) / 4 &&
        top >=
          -100 - (this.thumbnailHeight() - this.relatedThumbnailHeight()) / 4
      ) {
        return true;
      } else if (
        !isHover &&
        isRelated &&
        left <= 100 &&
        left >= -100 &&
        top <=
          100 - (this.thumbnailHeight() - this.relatedThumbnailHeight()) / 2 &&
        top >=
          -100 - (this.thumbnailHeight() - this.relatedThumbnailHeight()) / 2
      ) {
        return true;
      } else if (
        isHover &&
        isRelated &&
        left <=
          100 + (this.thumbnailWidth() - this.relatedThumbnailWidth()) / 4 &&
        left >=
          -100 - (this.thumbnailWidth() - this.relatedThumbnailWidth()) / 4 &&
        top <=
          100 + (this.thumbnailHeight() - this.relatedThumbnailHeight()) / 4 &&
        top >=
          -100 - (this.thumbnailHeight() - this.relatedThumbnailHeight()) / 4
      ) {
        return true;
      }
      return false;
    },
    checkCollision() {
      clearInterval(this.secondRelatedImageInterval);
      this.moveToImageTimeout.forEach(clearTimeout);
      this.moveToImageTimeout = [];

      let thumbnail = this.$refs.divCar.getBoundingClientRect();
      let left = this.carouselHover
        ? thumbnail.left - this.windowWidth / 2 + this.thumbnailWidth() / 2
        : thumbnail.left -
          this.windowWidth / 2 +
          this.relatedThumbnailWidth() / 2;
      let top = this.carouselHover
        ? thumbnail.top - this.windowHeight / 2 + this.thumbnailHeight() / 2
        : thumbnail.top -
          this.windowHeight / 2 +
          this.relatedThumbnailHeight() / 2;
      this.carouselHover = this.colision(top, left, this.carouselHover, false);
      this.centerTarget(thumbnail, null, false, this.carouselHover);

      this.relatedImagesPosition.forEach((rectangle, index) => {
        thumbnail = this.$refs["position" + index].getBoundingClientRect();
        left = rectangle.hover
          ? thumbnail.left - this.windowWidth / 2 + this.thumbnailWidth() / 2
          : thumbnail.left -
            this.windowWidth / 2 +
            this.relatedThumbnailWidth() / 2;
        top = rectangle.hover
          ? thumbnail.top - this.windowHeight / 2 + this.thumbnailHeight() / 2
          : thumbnail.top -
            this.windowHeight / 2 +
            this.relatedThumbnailHeight() / 2 -
            (this.thumbnailHeight() - this.relatedThumbnailHeight()) / 2;
        rectangle.hover = this.colision(top, left, rectangle.hover, true);
        this.centerTarget(thumbnail, rectangle, true, rectangle.hover);
      });
      if (this.moveToImageTimeout.length === 0 && !this.carouselHover) {
        this.stopSecondRelatedDisplay();
        this.rectangleHeight = this.relatedThumbnailHeight() + 20;
        this.rectangleWidth = this.relatedThumbnailWidth() + 20;
      } else {
        this.rectangleHeight = this.thumbnailHeight() + 20;
        this.rectangleWidth = this.thumbnailWidth() + 20;
      }
    },
    // Rectangle navigation
    startPosition() {
      this.isDrag = true;
    },
    endPosition() {
      this.isDrag = false;
    },
    mouseWheel() {
      if (!this.blockDrag) {
        this.checkCollision();
      } else {
        window.scrollTo({
          left: this.currentXPosition,
          top: this.currentYPosition,
        });
      }
    },
    touchMove() {
      if (this.isDrag && !this.blockDrag) {
        this.checkCollision();
      }
    },
    mouseMove(event) {
      if (this.isDrag && !this.blockDrag) {
        // Calculate the mouse movement and apply it on the current position
        const xMovement = this.currentXPosition - event.movementX;
        if (xMovement > 0 || xMovement < event.pageWidth) {
          this.currentXPosition = xMovement;
        }

        const yMovement = this.currentYPosition - event.movementY;
        if (yMovement > 0 || yMovement < event.pageHeight) {
          this.currentYPosition = yMovement;
        }

        // Calculate the position of the target
        this.rectangleXPosition =
          -this.$refs.display.getBoundingClientRect().left +
          this.windowWidth / 2 -
          this.rectangleWidth / 2;
        this.rectangleYPosition =
          -this.$refs.display.getBoundingClientRect().top +
          this.windowHeight / 2 -
          this.rectangleHeight / 2;
        // Move
        window.scrollTo({
          left: this.currentXPosition,
          top: this.currentYPosition,
        });
        this.checkCollision();
      }
    },
    // Slider part
    isStop() {
      return this.step > 290 && this.step < 310;
    },
    loadMoreContent(diffMaxIndexBeforeLoad) {
      if (
        this.currentIndex > this.data.length - diffMaxIndexBeforeLoad &&
        !this.isLoadingImage
      ) {
        this.$store.dispatch("loadNextContent", { decade: this.currentDecade });
      }
    },
    move(forward) {
      this.loadMoreContent(80);

      if (forward) {
        if (this.currentIndex !== this.data.length - 1) {
          this.currentIndex = this.currentIndex + 1;
          if (this.maxVisitedIndex < this.currentIndex) {
            this.maxVisitedIndex = this.currentIndex;
            this.completion =
              this.originalCompletion +
              Math.ceil((this.maxVisitedIndex * 100) / this.totalIndex);
            this.completion = this.completion <= 100 ? this.completion : 100;
            this.$store.dispatch("updateCompletion", {
              decade: this.currentDecade,
              completion: this.completion,
              maxVisitedIndex: this.maxVisitedIndex,
            });
          }
        }
      } else if (this.currentIndex !== 0) {
        this.currentIndex = this.currentIndex - 1;
      }
      // This incrementation is to manage the animation
      this.nbImageMove = this.nbImageMove + 1;
    },
    launchMovement(newSpeed, direction) {
      this.move(direction);
      this.speed = newSpeed;
      this.interval.push(
        setInterval(() => {
          this.move(direction);
        }, this.speed)
      );
    },
    movementAnalysis(newSpeed, direction) {
      if (
        newSpeed !== this.previousSpeed ||
        this.previousDirection !== direction
      ) {
        this.stopInterval();
        this.launchMovement(newSpeed, direction);
      }
    },
    sliderChange() {
      clearTimeout(this.endOfSlider);
      this.endOfSlider = undefined;
      this.viewerImageMode = false;
      // Release animation
      if (this.previousSpeed === 0 && this.step !== 300) {
        this.nbImageMove = 0;
      }
      if (this.isStop()) {
        clearTimeout(this.timeout);
        // Wait to ensure that we are stopped in the stopping step and not change the direction
        this.timeout = setTimeout(() => {
          if (this.isStop()) {
            this.releaseSlider(300);
          }
        }, 200);
      } else {
        this.shouldRunRelatedImageTransition = false;
        this.shouldStartRelatedImageSearch = true;
        this.shouldLoadRelatedImage = false;
        this.isDrag = false;
        this.stopDisplayRelatedImages();
        this.decelerateTimouts.forEach(clearTimeout);
        const newSpeed = this.speedSelection();
        this.animationStepAnalysis(newSpeed);

        const direction = this.step <= 290;
        this.movementAnalysis(newSpeed, direction);

        // Keep track of the state for next step of the slider change
        this.previousSpeed = newSpeed;
        this.previousDirection = direction;
      }
    },
    // Method to slow down the slider when the speed is fast and the slider is released
    launchDecelerate(direction) {
      this.decelerateTimouts.push(
        setTimeout(() => {
          this.speed = 250;
          this.move(direction);
        }, 50)
      );
      this.decelerateTimouts.push(
        setTimeout(() => {
          this.speed = 500;
          this.move(direction);
        }, 250)
      );
      this.decelerateTimouts.push(
        setTimeout(() => {
          this.speed = 1000;
          this.move(direction);
          this.$store.dispatch("loadRelatedImages", {
            tags: this.data[this.currentIndex].tags,
            id: this.data[this.currentIndex].id,
          });
          this.setupPosition();
          setTimeout(() => {
            this.viewerImageMode = true;
            this.shouldRunDecelerateAnimation = false;
          }, 1000);
        }, 500)
      );
    },
    getBackPreviousPosition() {
      const imagePosition = this.$refs[
        "image-" + this.currentIndex
      ].getBoundingClientRect();
      if (
        this.previousDirection &&
        imagePosition.y > imagePosition.height / 2 &&
        this.currentIndex !== 0
      ) {
        this.currentIndex = this.currentIndex - 1;
      } else if (!this.previousDirection && imagePosition.y < 0) {
        this.currentIndex = this.currentIndex + 1;
      }
    },
    releaseSlider(releaseStep) {
      // Reset Interval and Timeout
      clearTimeout(this.timeout);
      this.stopInterval();

      this.shouldLoadRelatedImage = true;
      this.shouldRunSideAnimation = false;
      this.previousSpeed = 0;

      if (releaseStep <= 140 || releaseStep > 470) {
        // Reset movement and animation parameters
        if (releaseStep < 100 || releaseStep > 530) {
          this.shouldRunDecelerateAnimation = true;
        }
        this.shouldStartRelatedImageSearch = false;
        this.launchDecelerate(this.previousDirection);
      }

      this.step = 300;

      if (releaseStep === 300) {
        // This part analyze where we are in the sliding process to get back to the previous image in case we stop the slider.
        this.getBackPreviousPosition();
        this.zoomingStep = -1;
        this.speed = 6000;
        this.previousDirection = undefined;
        if (this.shouldStartRelatedImageSearch) {
          this.$store.dispatch("loadRelatedImages", {
            tags: this.data[this.currentIndex].tags,
            id: this.data[this.currentIndex].id,
          });
          this.setupPosition();
          this.endOfSlider = setTimeout(
            () => (this.viewerImageMode = true),
            1200
          );
        }
      }
    },
    animationStepAnalysis(speed) {
      if (this.previousSpeed > speed) {
        this.zoomingStep = 2;
      } else if (this.previousSpeed <= 125 && this.previousSpeed !== 0) {
        this.zoomingStep = 1;
      } else if (this.previousSpeed < speed && this.speed > 1000) {
        this.zoomingStep = 2;
      }
    },
    stopInterval() {
      this.interval.forEach((element) => clearInterval(element));
      this.interval = [];
    },
    // Select randomly 3 display positions
    setupPosition() {
      this.potentialPosition
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .forEach((position) => {
          this.relatedImagesPosition.push({
            position: position,
            image: undefined,
            display: false,
            hover: false,
            isTarget: false,
          });
        });
    },
    displayRelatedImages(images) {
      this.$store.dispatch("removeSecondRelatedInformation");
      images.forEach((image, index) => {
        if (this.relatedImagesPosition[index].image === undefined) {
          this.relatedImagesPosition[index].image = image;
        }

        this.$store.dispatch("setRelatedImagePosition", {
          id: image.result.id,
          position: this.relatedImagesPosition[index].position,
        });
        this.$store.dispatch("loadSecondRelatedImages", {
          tags: image.result.tags,
          id: image.result.id,
          position: this.relatedImagesPosition[index].position,
        });
      });
      // Setup the display animation
      this.$nextTick(() => {
        this.relatedImagesPosition.forEach((element, index) => {
          if (this.carouselHover) {
            const animationDelay = 1000 + 2000 * index;
            this.displayRelatedImageTimeout.push(
              setTimeout(() => {
                if (this.relatedImagesPosition[index]) {
                  this.relatedImagesPosition[index].display = true;
                  this.$nextTick(() => {
                    this.shouldUpdateDisplay = true;
                  });
                }
              }, animationDelay)
            );
          } else {
            if (this.relatedImagesPosition[index]) {
              this.relatedImagesPosition[index].display = true;
              this.$nextTick(() => {
                this.shouldUpdateDisplay = true;
                this.shouldRunRelatedImageTransition = true;
              });
            }
          }
        });
      });
    },
    stopDisplayRelatedImages() {
      this.displayRelatedImageTimeout.forEach(clearTimeout);
      this.displayRelatedImageTimeout = [];
      this.relatedImagesPosition = [];
    },
    loadSecondRelatedImages(decade, nextId, relatedImages) {
      this.displaySecondRelatedImages(relatedImages);
      let newData;
      let newIndex = -1;
      // Load bundle of images related to the selected related image
      this.secondRelatedImageTimeout.push(
        setTimeout(() => {
          this.couldLoad = false;
          newData = this.getImagesByDecade(decade);
          if (newData === undefined) {
            this.loadDataWithSkipId(decade, nextId);
          } else {
            newIndex = newData.data.findIndex((e) => {
              return e.id == nextId;
            });
            if (newIndex === -1) {
              this.loadDataWithSkipId(decade, nextId);
            }
          }
        }, 2000)
      );
      // Setup state of new center image
      this.secondRelatedImageTimeout.push(
        setTimeout(() => {
          this.couldLoad = true;
          this.relatedImagesPosition = this.secondRelatedImagesPosition;
          this.secondRelatedImagesPosition = [];
          this.currentXPosition = this.defineLeftPositionCenterPage();
          this.currentYPosition = this.defineTopPositionCenterPage();
          this.carouselHover = true;
          this.currentDecade = decade;
          if (newIndex !== -1) {
            this.currentIndex = newIndex;
            this.data = newData.data;
          } else {
            this.data = this.getImagesByDecade(this.currentDecade).data;
            const id = this.data.findIndex((e) => {
              return e.id == nextId;
            });
            this.currentIndex = id;
          }

          this.shouldRunCentralImageTransition = false;
          window.scrollTo(this.currentXPosition, this.currentYPosition);
          this.$store.dispatch("removeSecondRelatedInformation");
          this.relatedImagesPosition.forEach((image) => {
            this.$store.dispatch("loadSecondRelatedImages", {
              tags: image.image.result.tags,
              id: image.image.result.id,
              position: image.position,
            });
          });
          this.shouldDisplayLoading = true;
          this.$store.dispatch("insertHistory", {
            decade: this.currentDecade,
            imageId: this.data[this.currentIndex].id,
            data: this.data[this.currentIndex].imagePaths.square,
          });
        }, 8000)
      );
    },
    // This methods setup the display of related images from a related image
    displaySecondRelatedImages(images) {
      // Select randomly 3 display positions
      this.potentialPosition
        .sort(() => Math.random() - 0.5)
        .slice(0, images.length)
        .forEach((position, index) => {
          this.secondRelatedImagesPosition.push({
            position: position,
            image: images[index],
            display: false,
            hover: false,
            isTarget: false,
          });
        });
      // Setup the display animation
      this.$nextTick(() => {
        this.secondRelatedImagesPosition.forEach((element, index) => {
          const animationDelay = 1000 + 2000 * index;
          this.displayRelatedImageTimeout.push(
            setTimeout(() => {
              if (this.secondRelatedImagesPosition[index]) {
                this.secondRelatedImagesPosition[index].display = true;
                this.$nextTick(() => {
                  this.shouldUpdateDisplay = true;
                });
              }
            }, animationDelay)
          );
        });
      });
    },
    stopSecondRelatedDisplay() {
      this.secondRelatedTagsElements = [];
      this.fullHistoryMode = false;
      this.secondRelatedImageTimeout.forEach((e) => clearTimeout(e));
      this.secondRelatedImageTimeout = [];
      this.shouldRunCentralImageTransition = true;
      this.secondRelatedImagesPosition = [];
      this.couldLoad = true;
    },
    speedSelection() {
      // Find the transition speed
      switch (true) {
        case this.step <= 20:
          return 50;
        case this.step <= 60:
          return 62;
        case this.step <= 100:
          return 125;
        case this.step <= 140:
          return 250;
        case this.step <= 150:
          return 375;
        case this.step <= 190:
          return 500;
        case this.step <= 210:
          return 750;
        case this.step <= 230:
          return 1000;
        case this.step <= 250:
          return 1500;
        case this.step <= 270:
          return 2000;
        case this.step <= 290:
          return 4000;
        case this.step > 290 && this.step < 310:
          return 6000;
        case this.step <= 330:
          return 4000;
        case this.step <= 350:
          return 2000;
        case this.step <= 370:
          return 1500;
        case this.step <= 390:
          return 1000;
        case this.step <= 410:
          return 750;
        case this.step <= 440:
          return 500;
        case this.step <= 470:
          return 375;
        case this.step <= 500:
          return 250;
        case this.step <= 530:
          return 125;
        case this.step <= 570:
          return 62;
        case this.step <= 600:
          return 50;
      }
    },
    // Position and size calculation methods
    thumbnailHeight() {
      return 17 * 4 * this.defineReponsiveFactor();
    },
    thumbnailWidth() {
      return 9 * 4 * this.defineReponsiveFactor();
    },
    relatedThumbnailHeight() {
      return 9 * 4 * this.defineReponsiveFactor();
    },
    relatedThumbnailWidth() {
      return 8 * 4 * this.defineReponsiveFactor();
    },
    defineReponsiveFactor() {
      switch (true) {
        case this.windowWidth >= 1000 && this.windowHeight >= 920:
          return 10;
        case this.windowWidth >= 700 && this.windowHeight >= 716:
          return 7;
        case this.windowWidth >= 550 && this.windowHeight >= 615:
          return 5.5;
        case this.windowWidth >= 450 && this.windowHeight >= 548:
          return 4.5;
        case this.windowWidth >= 400 && this.windowHeight >= 514:
          return 4;
        case this.windowWidth >= 350 && this.windowHeight >= 480:
          return 3.5;
        default:
          return 3;
      }
    },
    defineTopImagePosition() {
      return (this.pageHeight - this.thumbnailHeight()) / 2;
    },
    defineLeftImagePosition() {
      return (this.pageWidth - this.thumbnailWidth()) / 2;
    },
    defineTopSliderPosition() {
      return (
        (this.pageHeight - this.thumbnailHeight()) / 2 +
        this.thumbnailHeight() / 2 -
        150
      );
    },
    defineLeftSliderPosition() {
      return this.pageWidth / 2 + this.thumbnailWidth() / 2;
    },
    defineLeftPositionCenterPage() {
      return this.pageWidth / 2 - this.windowWidth / 2;
    },
    defineTopPositionCenterPage() {
      return this.pageHeight / 2 - this.windowHeight / 2;
    },
    getRelatedImagePosition(relatedImage, originX, originY) {
      switch (relatedImage.position) {
        case 1:
          return relatedImage.hover
            ? [
                (this.pageHeight -
                  this.thumbnailHeight() -
                  this.thumbnailHeight() / 4) /
                  2 -
                  this.thumbnailHeight() / 2.1,
                originX - this.thumbnailWidth() * 1.3,
              ]
            : [
                originY - this.thumbnailHeight() / 2.1,
                originX - this.thumbnailWidth() * 1.3,
              ];
        case 2:
          return relatedImage.hover
            ? [
                (this.pageHeight -
                  this.thumbnailHeight() -
                  this.thumbnailHeight() / 2) /
                  2 -
                  this.thumbnailHeight() / 2.1,
                originX + this.thumbnailWidth() * 1.3,
              ]
            : [
                originY - this.thumbnailHeight() / 2.1,
                originX + this.thumbnailWidth() * 1.3,
              ];
        case 3:
          return relatedImage.hover
            ? [
                (this.pageHeight -
                  this.thumbnailHeight() -
                  this.thumbnailHeight() / 2) /
                  2 +
                  this.thumbnailHeight() / 4,
                originX - this.thumbnailWidth() * 2.5,
              ]
            : [
                originY + this.thumbnailHeight() / 4,
                originX - this.thumbnailWidth() * 2.5,
              ];
        case 4:
          return relatedImage.hover
            ? [
                (this.pageHeight -
                  this.thumbnailHeight() -
                  this.thumbnailHeight() / 2) /
                  2 +
                  this.thumbnailHeight() / 4,
                originX + this.thumbnailWidth() * 2.5,
              ]
            : [
                originY + this.thumbnailHeight() / 4,
                originX + this.thumbnailWidth() * 2.5,
              ];
        case 5:
          return relatedImage.hover
            ? [
                (this.pageHeight -
                  this.thumbnailHeight() -
                  this.thumbnailHeight() / 2) /
                  2 +
                  this.thumbnailHeight(),
                originX - this.thumbnailWidth() * 1.3,
              ]
            : [
                originY + this.thumbnailHeight(),
                originX - this.thumbnailWidth() * 1.3,
              ];
        case 6:
          return relatedImage.hover
            ? [
                (this.pageHeight -
                  this.thumbnailHeight() -
                  this.thumbnailHeight() / 2) /
                  2 +
                  this.thumbnailHeight(),
                originX + this.thumbnailWidth() * 1.3,
              ]
            : [
                originY + this.thumbnailHeight(),
                originX + this.thumbnailWidth() * 1.3,
              ];
        default:
          return [0, 0];
      }
    },
    imageInformationTopTagPosition() {
      switch (true) {
        case this.windowWidth < 700:
          return 60;
        case this.windowWidth < 900:
          return 60;
        default:
          return 80;
      }
    },
    imageInformationTopPosition() {
      switch (true) {
        case this.windowWidth < 700:
          return 40;
        default:
          return 60;
      }
    },
    indexInformationTopPosition() {
      switch (true) {
        case this.windowWidth < 700:
          return 40;
        default:
          return 80;
      }
    },
  },
  computed: {
    relatedOver() {
      return this.relatedImagesPosition.filter((e) => e.hover).length > 0;
    },
    completionSize() {
      switch (true) {
        case this.windowWidth < 700:
          return 60;
        default:
          return 100;
      }
    },
    topCompletioPosition() {
      switch (true) {
        case this.windowWidth < 700:
          return -20;
        case this.windowWidth < 900:
          return -40;
        default:
          return -40;
      }
    },
    setPage() {
      return {
        height: this.pageHeight + "px",
        width: this.pageWidth + "px",
        cursor: "pointer",
        "user-select": "none",
      };
    },
    imageInformationPositionTag() {
      return {
        position: "absolute",
        top:
          this.defineTopImagePosition() -
          this.imageInformationTopTagPosition() +
          "px",
        left: this.defineLeftImagePosition() - 10 + "px",
        width: this.thumbnailWidth() + 20 + "px",
      };
    },
    imageInformationPosition() {
      return {
        position: "absolute",
        top:
          this.defineTopImagePosition() -
          this.imageInformationTopPosition() +
          "px",
        left: this.defineLeftImagePosition() - 10 + "px",
        width: this.thumbnailWidth() + 20 + "px",
      };
    },
    secondImageInformationPosition() {
      return {
        height: "40px",
        position: "absolute",
        top: this.newOriginY - 60 + "px",
        left: this.newOriginX + "px",
        display: "flex",
        width: this.thumbnailWidth() + 20 + "px",
      };
    },
    indexInformationPosition() {
      return {
        position: "absolute",
        top:
          this.defineTopImagePosition() -
          this.indexInformationTopPosition() +
          "px",
        left: this.defineLeftImagePosition() + "px",
        width: this.thumbnailWidth() + 10 + "px",
        "text-align": "end",
        "z-index": "-1",
      };
    },
    imageCreatorPosition() {
      return {
        top: this.defineTopImagePosition() + this.thumbnailHeight() + "px",
        left: this.defineLeftImagePosition() - 10 + "px",
        width: this.thumbnailWidth() + 20 + "px",
      };
    },
    imageStoryPosition() {
      return {
        top: this.defineTopImagePosition() + this.thumbnailHeight() + 40 + "px",
        left: this.defineLeftImagePosition() - 10 + "px",
        width: this.thumbnailWidth() + 20 + "px",
      };
    },
    imagePosition() {
      return {
        position: "absolute",
        top: this.defineTopImagePosition() + "px",
        left: this.defineLeftImagePosition() + "px",
      };
    },
    imageViewerDisplay() {
      return {
        position: "absolute",
        height: this.carouselHover
          ? this.thumbnailHeight() + "px"
          : this.relatedThumbnailHeight() + "px",
        width: this.carouselHover
          ? this.thumbnailWidth() + "px"
          : this.relatedThumbnailWidth() + "px",
        "margin-top": this.carouselHover
          ? 0
          : (this.thumbnailHeight() - this.relatedThumbnailHeight()) / 2 + "px",
        transition: this.shouldRunCentralImageTransition
          ? "height 0.3s, margin 0.3s"
          : "height 0s, margin 0s",
      };
    },
    relatedImagePosition1() {
      const positions = this.getRelatedImagePosition(
        this.relatedImagesPosition[0],
        this.defineLeftImagePosition(),
        this.defineTopImagePosition()
      );
      return {
        position: "absolute",
        top: positions[0] + "px",
        left: positions[1] + "px",
        overflow: "hidden",
        height: this.thumbnailHeight() + "px",
        width: this.thumbnailWidth() + "px",
      };
    },
    relatedImageDisplay1() {
      return {
        position: "absolute",
        height: this.relatedImagesPosition[0].hover
          ? this.thumbnailHeight() + "px"
          : this.relatedThumbnailHeight() + "px",
        width: this.relatedImagesPosition[0].hover
          ? this.thumbnailWidth() + "px"
          : this.relatedThumbnailWidth() + "px",
        "margin-top": this.relatedImagesPosition[0].hover
          ? 0
          : (this.thumbnailHeight() - this.relatedThumbnailHeight()) / 2 + "px",
        transition: "height 0.3s, margin 0.3s",
      };
    },
    secondRelatedImagePosition1() {
      const positions = this.getRelatedImagePosition(
        this.secondRelatedImagesPosition[0],
        this.newOriginX,
        this.newOriginY
      );
      return {
        position: "absolute",
        top: positions[0] + "px",
        left: positions[1] + "px",
        overflow: "hidden",
        height: this.thumbnailHeight() + "px",
        width: this.thumbnailWidth() + "px",
      };
    },
    secondRelatedImageDisplay1() {
      return {
        position: "absolute",
        height: this.secondRelatedImagesPosition[0].hover
          ? this.thumbnailHeight() + "px"
          : this.relatedThumbnailHeight() + "px",
        width: this.secondRelatedImagesPosition[0].hover
          ? this.thumbnailWidth() + "px"
          : this.relatedThumbnailWidth() + "px",
        "margin-top": this.secondRelatedImagesPosition[0].hover
          ? 0
          : (this.thumbnailHeight() - this.relatedThumbnailHeight()) / 2 + "px",
        transition: "height 0.3s, margin 0.3s",
      };
    },
    relatedInformationPosition1() {
      const positions = this.getRelatedImagePosition(
        this.relatedImagesPosition[0],
        this.defineLeftImagePosition(),
        this.defineTopImagePosition()
      );
      let top = 0;
      if (
        positions[0] < this.pageHeight / 2 &&
        this.relatedImagesPosition[0].hover
      ) {
        top =
          positions[0] +
          this.relatedThumbnailHeight() +
          (this.thumbnailHeight() - this.relatedThumbnailHeight()) / 2 +
          this.relatedThumbnailHeight() / 2;
      } else if (positions[0] < this.pageHeight / 2) {
        top =
          positions[0] +
          this.relatedThumbnailHeight() +
          (this.thumbnailHeight() - this.relatedThumbnailHeight()) / 2;
      } else if (
        positions[0] >= this.pageHeight / 2 &&
        this.relatedImagesPosition[0].hover
      ) {
        if (
          this.relatedImagesPosition[0].position === 3 ||
          this.relatedImagesPosition[0].position === 4
        ) {
          top =
            positions[0] +
            this.relatedThumbnailHeight() / 4 +
            this.thumbnailHeight();
        } else {
          top = positions[0] + this.thumbnailHeight();
        }
      } else {
        top = positions[0] + this.relatedThumbnailHeight() / 4;
      }
      return {
        position: "absolute",
        top: top + "px",
        left: this.relatedImagesPosition[0].hover
          ? positions[1] - 10 + "px"
          : positions[1] + "px",
        overflow: "hidden",
        "text-align": positions[1] < this.pageWidth / 2 ? "end" : "start",
        width: this.relatedImagesPosition[0].hover
          ? this.relatedThumbnailWidth() + 20 + "px"
          : this.relatedThumbnailWidth() + "px",
        height: "100px",
      };
    },
    secondRelatedInformationPosition1() {
      const positions = this.getRelatedImagePosition(
        this.secondRelatedImagesPosition[0],
        this.newOriginX,
        this.newOriginY
      );
      const top =
        positions[0] < this.newOriginY
          ? positions[0] +
            this.relatedThumbnailHeight() +
            (this.thumbnailHeight() - this.relatedThumbnailHeight()) / 2
          : positions[0] + this.relatedThumbnailHeight() / 4;
      return {
        position: "absolute",
        top: top + "px",
        left: positions[1] + "px",
        width: this.relatedThumbnailWidth() + "px",
        "text-align": positions[1] < this.newOriginX ? "end" : "start",
        overflow: "hidden",
      };
    },
    relatedImagePosition2() {
      const positions = this.getRelatedImagePosition(
        this.relatedImagesPosition[1],
        this.defineLeftImagePosition(),
        this.defineTopImagePosition()
      );
      return {
        position: "absolute",
        top: positions[0] + "px",
        left: positions[1] + "px",
        overflow: "hidden",
        height: this.thumbnailHeight() + "px",
        width: this.thumbnailWidth() + "px",
      };
    },
    relatedImageDisplay2() {
      return {
        position: "absolute",
        height: this.relatedImagesPosition[1].hover
          ? this.thumbnailHeight() + "px"
          : this.relatedThumbnailHeight() + "px",
        width: this.relatedImagesPosition[1].hover
          ? this.thumbnailWidth() + "px"
          : this.relatedThumbnailWidth() + "px",
        "margin-top": this.relatedImagesPosition[1].hover
          ? 0
          : (this.thumbnailHeight() - this.relatedThumbnailHeight()) / 2 + "px",
        transition: "height 0.3s, margin 0.3s",
      };
    },
    secondRelatedImagePosition2() {
      const positions = this.getRelatedImagePosition(
        this.secondRelatedImagesPosition[1],
        this.newOriginX,
        this.newOriginY
      );
      return {
        position: "absolute",
        top: positions[0] + "px",
        left: positions[1] + "px",
        overflow: "hidden",
        height: this.thumbnailHeight() + "px",
        width: this.thumbnailWidth() + "px",
      };
    },
    secondRelatedImageDisplay2() {
      return {
        position: "absolute",
        height: this.secondRelatedImagesPosition[1].hover
          ? this.thumbnailHeight() + "px"
          : this.relatedThumbnailHeight() + "px",
        width: this.secondRelatedImagesPosition[1].hover
          ? this.thumbnailWidth() + "px"
          : this.relatedThumbnailWidth() + "px",
        "margin-top": this.secondRelatedImagesPosition[1].hover
          ? 0
          : (this.thumbnailHeight() - this.relatedThumbnailHeight()) / 2 + "px",
        transition: "height 0.3s, margin 0.3s",
      };
    },
    relatedInformationPosition2() {
      const positions = this.getRelatedImagePosition(
        this.relatedImagesPosition[1],
        this.defineLeftImagePosition(),
        this.defineTopImagePosition()
      );
      let top = 0;
      if (
        positions[0] < this.pageHeight / 2 &&
        this.relatedImagesPosition[1].hover
      ) {
        top =
          positions[0] +
          this.relatedThumbnailHeight() +
          (this.thumbnailHeight() - this.relatedThumbnailHeight()) / 2 +
          this.relatedThumbnailHeight() / 2;
      } else if (positions[0] < this.pageHeight / 2) {
        top =
          positions[0] +
          this.relatedThumbnailHeight() +
          (this.thumbnailHeight() - this.relatedThumbnailHeight()) / 2;
      } else if (
        positions[0] >= this.pageHeight / 2 &&
        this.relatedImagesPosition[1].hover
      ) {
        if (
          this.relatedImagesPosition[0].position === 3 ||
          this.relatedImagesPosition[0].position === 4
        ) {
          top =
            positions[0] +
            this.relatedThumbnailHeight() / 4 +
            this.thumbnailHeight();
        } else {
          top = positions[0] + this.thumbnailHeight();
        }
      } else {
        top = positions[0] + this.relatedThumbnailHeight() / 4;
      }
      return {
        position: "absolute",
        top: top + "px",
        left: this.relatedImagesPosition[1].hover
          ? positions[1] - 10 + "px"
          : positions[1] + "px",
        width: this.relatedImagesPosition[1].hover
          ? this.relatedThumbnailWidth() + 20 + "px"
          : this.relatedThumbnailWidth() + "px",
        height: "100px",
        "text-align": positions[1] < this.pageWidth / 2 ? "end" : "start",
        overflow: "hidden",
      };
    },
    secondRelatedInformationPosition2() {
      const positions = this.getRelatedImagePosition(
        this.secondRelatedImagesPosition[1],
        this.newOriginX,
        this.newOriginY
      );
      const top =
        positions[0] < this.newOriginY
          ? positions[0] +
            this.relatedThumbnailHeight() +
            (this.thumbnailHeight() - this.relatedThumbnailHeight()) / 2
          : positions[0] + this.relatedThumbnailHeight() / 4;
      return {
        position: "absolute",
        top: top + "px",
        left: positions[1] + "px",
        width: this.relatedThumbnailWidth() + "px",
        "text-align": positions[1] < this.newOriginX ? "end" : "start",
        overflow: "hidden",
      };
    },
    relatedImagePosition3() {
      const positions = this.getRelatedImagePosition(
        this.relatedImagesPosition[2],
        this.defineLeftImagePosition(),
        this.defineTopImagePosition()
      );
      return {
        position: "absolute",
        top: positions[0] + "px",
        left: positions[1] + "px",
        overflow: "hidden",
        height: this.thumbnailHeight() + "px",
        width: this.thumbnailWidth() + "px",
      };
    },
    relatedImageDisplay3() {
      return {
        position: "absolute",
        height: this.relatedImagesPosition[2].hover
          ? this.thumbnailHeight() + "px"
          : this.relatedThumbnailHeight() + "px",
        width: this.relatedImagesPosition[2].hover
          ? this.thumbnailWidth() + "px"
          : this.relatedThumbnailWidth() + "px",
        "margin-top": this.relatedImagesPosition[2].hover
          ? 0
          : (this.thumbnailHeight() - this.relatedThumbnailHeight()) / 2 + "px",
        transition: "height 0.3s, margin 0.3s",
      };
    },
    secondRelatedImagePosition3() {
      const positions = this.getRelatedImagePosition(
        this.secondRelatedImagesPosition[2],
        this.newOriginX,
        this.newOriginY
      );
      return {
        position: "absolute",
        top: positions[0] + "px",
        left: positions[1] + "px",
        overflow: "hidden",
        height: this.thumbnailHeight() + "px",
        width: this.thumbnailWidth() + "px",
      };
    },
    secondRelatedImageDisplay3() {
      return {
        position: "absolute",
        height: this.secondRelatedImagesPosition[2].hover
          ? this.thumbnailHeight() + "px"
          : this.relatedThumbnailHeight() + "px",
        width: this.secondRelatedImagesPosition[2].hover
          ? this.thumbnailWidth() + "px"
          : this.relatedThumbnailWidth() + "px",
        "margin-top": this.secondRelatedImagesPosition[2].hover
          ? 0
          : (this.thumbnailHeight() - this.relatedThumbnailHeight()) / 2 + "px",
        transition: "height 0.3s, margin 0.3s",
      };
    },
    relatedInformationPosition3() {
      const positions = this.getRelatedImagePosition(
        this.relatedImagesPosition[2],
        this.defineLeftImagePosition(),
        this.defineTopImagePosition()
      );
      let top = 0;
      if (
        positions[0] < this.pageHeight / 2 &&
        this.relatedImagesPosition[2].hover
      ) {
        top =
          positions[0] +
          this.relatedThumbnailHeight() +
          (this.thumbnailHeight() - this.relatedThumbnailHeight()) / 2 +
          this.relatedThumbnailHeight() / 2;
      } else if (positions[0] < this.pageHeight / 2) {
        top =
          positions[0] +
          this.relatedThumbnailHeight() +
          (this.thumbnailHeight() - this.relatedThumbnailHeight()) / 2;
      } else if (
        positions[0] >= this.pageHeight / 2 &&
        this.relatedImagesPosition[2].hover
      ) {
        if (
          this.relatedImagesPosition[0].position === 3 ||
          this.relatedImagesPosition[0].position === 4
        ) {
          top =
            positions[0] +
            this.relatedThumbnailHeight() / 4 +
            this.thumbnailHeight();
        } else {
          top = positions[0] + this.thumbnailHeight();
        }
      } else {
        top = positions[0] + this.relatedThumbnailHeight() / 4;
      }
      return {
        position: "absolute",
        top: top + "px",
        left: this.relatedImagesPosition[2].hover
          ? positions[1] - 10 + "px"
          : positions[1] + "px",
        width: this.relatedImagesPosition[2].hover
          ? this.relatedThumbnailWidth() + 20 + "px"
          : this.relatedThumbnailWidth() + "px",
        height: "100px",
        "text-align": positions[1] < this.pageWidth / 2 ? "end" : "start",
        overflow: "hidden",
      };
    },
    secondRelatedInformationPosition3() {
      const positions = this.getRelatedImagePosition(
        this.secondRelatedImagesPosition[2],
        this.newOriginX,
        this.newOriginY
      );
      const top =
        positions[0] < this.newOriginY
          ? positions[0] +
            this.relatedThumbnailHeight() +
            (this.thumbnailHeight() - this.relatedThumbnailHeight()) / 2
          : positions[0] + this.relatedThumbnailHeight() / 4;
      return {
        position: "absolute",
        top: top + "px",
        left: positions[1] + "px",
        width: this.relatedThumbnailWidth() + "px",
        "text-align": positions[1] < this.newOriginX ? "end" : "start",
        overflow: "hidden",
      };
    },
    fontSliderPosition() {
      return {
        position: "absolute",
        top: this.defineTopSliderPosition() + 75 + "px",
        left: this.defineLeftSliderPosition() + 33 + "px",
      };
    },
    sliderPosition() {
      return {
        position: "absolute",
        top: this.defineTopSliderPosition() + 30 + "px",
        left: this.defineLeftSliderPosition() + 32 + "px",
      };
    },
    scrollingDisplay() {
      return {
        overflow: "hidden",
        margin: 0,
        padding: 0,
      };
    },
    componentSize() {
      return {
        height: this.thumbnailHeight() + "px",
        width: this.thumbnailWidth() + "px",
      };
    },
    imageUnzoomEffect() {
      return {
        "v-zoom": this.step !== 300,
        "v-unzoom": this.step === 300,
      };
    },
    // Setup image display and translation for the scrolling
    scrollingMovement() {
      return {
        "-webkit-transform":
          "translateY(-" + this.thumbnailHeight() * this.currentIndex + "px)",
        "-moz-transform":
          "translateY(-" + this.thumbnailHeight() * this.currentIndex + "px)",
        transform:
          "translateY(-" + this.thumbnailHeight() * this.currentIndex + "px)",
      };
    },
    // Base on the movement step and speed, select the right animation
    selectZoomAnimation() {
      return {
        zoomTransitionImageFast:
          this.speed <= 125 &&
          !this.isBeginning &&
          !this.isEnd &&
          (this.zoomingStep === 1 || this.zoomingStep === 2),
        zoomTransitionImageMedium:
          this.speed > 125 &&
          this.speed <= 1000 &&
          this.zoomingStep === 2 &&
          !this.isBeginning &&
          !this.isEnd,
        zoomTransitionImageSlow:
          this.speed > 1000 &&
          this.speed < 6000 &&
          this.zoomingStep === 2 &&
          !this.isBeginning &&
          !this.isEnd,
        unzoomTransitionImageFastEnd:
          this.shouldRunDecelerateAnimation && !this.isBeginning && !this.isEnd,
        unzoomTransitionImageFast:
          (this.speed > 125 && this.zoomingStep === 1) ||
          ((this.isBeginning || this.isEnd) &&
            this.shouldRunSideAnimation &&
            this.speed <= 125),
      };
    },
    selectSliderTransitionSpeed() {
      return {
        "v-museum-end": this.speed === 6000,
        "v-museum-025": this.speed === 4000,
        "v-museum-05": this.speed === 2000,
        "v-museum-075": this.speed === 1500,
        "v-museum-1": this.speed === 1000,
        "v-museum-1_5": this.speed === 750,
        "v-museum-2": this.speed === 500,
        "v-museum-3": this.speed === 375,
        "v-museum-4": this.speed === 250,
        "v-museum-8": this.speed === 125,
        "v-museum-16": this.speed === 62,
        "v-museum-20": this.speed === 50,
      };
    },

    selectArrayDisplay() {
      return {
        "v-start": this.isBeginning,
        "v-normal": !this.isBeginning && !this.isEnd,
        "v-end": this.isEnd,
      };
    },
    ...mapState([
      "images",
      "isLoadingImage",
      "relatedImages",
      "secondRelatedImages",
      "completionData",
    ]),
    ...mapGetters({
      getImagesByDecade: "getImagesByDecade",
      getCompletionByDecade: "getCompletionByDecade",
      getVisitedIndexByDecade: "getVisitedIndexByDecade",
      getSecondRelatedTags: "getSecondRelatedTagsByPosition",
      getRelatedImages: "getRelatedImages",
      getSecondRelatedImages: "getSecondRelatedImageById",
    }),
  },
  mounted() {
    this.shouldRunRelatedImageTransition = false;
    this.$store.dispatch("restartLoadingState");

    this.$refs.display.addEventListener(
      "DOMMouseScroll",
      this.mouseWheel,
      false
    );

    const { width, height } = useWindowSize();
    this.windowHeight = height;
    this.windowWidth = width;

    this.rectangleHeight = this.thumbnailHeight() + 20;
    this.rectangleWidth = this.thumbnailWidth() + 20;

    this.currentXPosition = this.defineLeftPositionCenterPage();
    this.currentYPosition = this.defineTopPositionCenterPage();

    this.currentDecade = this.$route.params.decade;
    const data = this.getImagesByDecade(this.currentDecade);

    const lastVisitiedElement = this.getVisitedIndexByDecade(
      this.currentDecade
    );

    let id = 0;
    let currentIndex = 0;

    if (lastVisitiedElement) {
      id = lastVisitiedElement.lastId;
      currentIndex = lastVisitiedElement.lastIndex;
    }

    if (data === undefined) {
      if (id > 0) {
        this.$store.dispatch("insertSkipId", {
          decade: this.currentDecade,
          id: id,
        });
      }
      this.$store.dispatch("initializeCarousel", {
        decade: this.currentDecade,
        id: id,
      });
    } else {
      this.data = data.data;
      this.currentIndex = 0;
      if (this.data[currentIndex] && this.data[currentIndex].id === id) {
        this.currentIndex = currentIndex;
      } else {
        const searchIndex = this.data.findIndex((e) => {
          return e.id == id;
        });
        if (searchIndex !== -1) {
          this.currentIndex = searchIndex;
        }
      }

      if (this.currentIndex >= this.data.length - 100) {
        this.$store.dispatch("loadNextContent", {
          decade: this.currentDecade,
        });
      }

      this.loadInitialData();
    }
  },
};
</script>

<style scoped>
@import "./css/imageselector.css";
@import "./css/sliderspeed.css";
@import "./css/carouselAnimation.css";
@import "./css/loader.css";
@import "./css/text.css";
</style>
