import { shallowMount } from "@vue/test-utils";
import { expect } from "chai";
import sinon from "sinon";

import ImageSelector from "../../../../src/components/ImageSelector/ImageSelector.vue";
import ImageData from "../../../../src/models/ImageData";

describe("Test ImageSelector component", () => {
  const sandbox = sinon.createSandbox();
  const $store = {
    state: {
      navNextDecade: String,
      navNextOffset: 1,
      images: [],
    },
    dispatch: function() {},
  };

  let wrapper;
  beforeEach(() => {
    sandbox.spy($store);
    wrapper = shallowMount(ImageSelector, {
      global: {
        mocks: {
          $store,
        },
        // Remove warning and error due to element plus component not found
        config: {
          warnHandler: function(err, vm, info) {
            err = undefined;
            vm =undefined;
            info = undefined;
            return info;
          },
          errorHandler: function(err, vm, info) {
            err = undefined;
            vm =undefined;
            info = undefined;
            return info;
          }
        }
      },
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("Animation class computed testing", () => {
    wrapper.vm.$data.zoomingStep = 2;
    wrapper.vm.$data.step = 0;
    expect(wrapper.vm.selectZoomAnimation.zoomTransitionImageFast).to.be.true;
    expect(wrapper.vm.selectZoomAnimation.zoomTransitionImageMedium).to.be.false;
    expect(wrapper.vm.selectZoomAnimation.zoomTransitionImageSlow).to.be.false;
    expect(wrapper.vm.selectZoomAnimation.unzoomTransitionImageFastEnd).to.be.false;
    expect(wrapper.vm.selectZoomAnimation.unzoomTransitionImageFast).to.be.false;
    wrapper.vm.$data.step = 6;
    expect(wrapper.vm.selectZoomAnimation.zoomTransitionImageFast).to.be.true;
    expect(wrapper.vm.selectZoomAnimation.zoomTransitionImageMedium).to.be.false;
    expect(wrapper.vm.selectZoomAnimation.zoomTransitionImageSlow).to.be.false;
    expect(wrapper.vm.selectZoomAnimation.unzoomTransitionImageFastEnd).to.be.false;
    expect(wrapper.vm.selectZoomAnimation.unzoomTransitionImageFast).to.be.false;
    wrapper.vm.$data.step = 1;
    expect(wrapper.vm.selectZoomAnimation.zoomTransitionImageFast).to.be.false;
    expect(wrapper.vm.selectZoomAnimation.zoomTransitionImageMedium).to.be.true;
    expect(wrapper.vm.selectZoomAnimation.zoomTransitionImageSlow).to.be.false;
    expect(wrapper.vm.selectZoomAnimation.unzoomTransitionImageFastEnd).to.be.false;
    expect(wrapper.vm.selectZoomAnimation.unzoomTransitionImageFast).to.be.false;
    wrapper.vm.$data.step = 5;
    expect(wrapper.vm.selectZoomAnimation.zoomTransitionImageFast).to.be.false;
    expect(wrapper.vm.selectZoomAnimation.zoomTransitionImageMedium).to.be.true;
    expect(wrapper.vm.selectZoomAnimation.zoomTransitionImageSlow).to.be.false;
    expect(wrapper.vm.selectZoomAnimation.unzoomTransitionImageFastEnd).to.be.false;
    expect(wrapper.vm.selectZoomAnimation.unzoomTransitionImageFast).to.be.false;
    wrapper.vm.$data.step = 2;
    expect(wrapper.vm.selectZoomAnimation.zoomTransitionImageFast).to.be.false;
    expect(wrapper.vm.selectZoomAnimation.zoomTransitionImageMedium).to.be.false;
    expect(wrapper.vm.selectZoomAnimation.zoomTransitionImageSlow).to.be.true;
    expect(wrapper.vm.selectZoomAnimation.unzoomTransitionImageFastEnd).to.be.false;
    expect(wrapper.vm.selectZoomAnimation.unzoomTransitionImageFast).to.be.false;
    wrapper.vm.$data.step = 4;
    expect(wrapper.vm.selectZoomAnimation.zoomTransitionImageFast).to.be.false;
    expect(wrapper.vm.selectZoomAnimation.zoomTransitionImageMedium).to.be.false;
    expect(wrapper.vm.selectZoomAnimation.zoomTransitionImageSlow).to.be.true;
    expect(wrapper.vm.selectZoomAnimation.unzoomTransitionImageFastEnd).to.be.false;
    expect(wrapper.vm.selectZoomAnimation.unzoomTransitionImageFast).to.be.false;
    wrapper.vm.$data.step = 2;
    wrapper.vm.$data.zoomingStep = 1;
    expect(wrapper.vm.selectZoomAnimation.zoomTransitionImageFast).to.be.false;
    expect(wrapper.vm.selectZoomAnimation.zoomTransitionImageMedium).to.be.false;
    expect(wrapper.vm.selectZoomAnimation.zoomTransitionImageSlow).to.be.true;
    expect(wrapper.vm.selectZoomAnimation.unzoomTransitionImageFastEnd).to.be.false;
    expect(wrapper.vm.selectZoomAnimation.unzoomTransitionImageFast).to.be.false;
    wrapper.vm.$data.step = 4;
    expect(wrapper.vm.selectZoomAnimation.zoomTransitionImageFast).to.be.false;
    expect(wrapper.vm.selectZoomAnimation.zoomTransitionImageMedium).to.be.false;
    expect(wrapper.vm.selectZoomAnimation.zoomTransitionImageSlow).to.be.true;
    expect(wrapper.vm.selectZoomAnimation.unzoomTransitionImageFastEnd).to.be.false;
    expect(wrapper.vm.selectZoomAnimation.unzoomTransitionImageFast).to.be.false;
    wrapper.vm.$data.step = 3;
    wrapper.vm.$data.releaseStep = 0;
    expect(wrapper.vm.selectZoomAnimation.zoomTransitionImageFast).to.be.false;
    expect(wrapper.vm.selectZoomAnimation.zoomTransitionImageMedium).to.be.false;
    expect(wrapper.vm.selectZoomAnimation.zoomTransitionImageSlow).to.be.false;
    expect(wrapper.vm.selectZoomAnimation.unzoomTransitionImageFastEnd).to.be.true;
    expect(wrapper.vm.selectZoomAnimation.unzoomTransitionImageFast).to.be.false;
    wrapper.vm.$data.releaseStep = 6;
    expect(wrapper.vm.selectZoomAnimation.zoomTransitionImageFast).to.be.false;
    expect(wrapper.vm.selectZoomAnimation.zoomTransitionImageMedium).to.be.false;
    expect(wrapper.vm.selectZoomAnimation.zoomTransitionImageSlow).to.be.false;
    expect(wrapper.vm.selectZoomAnimation.unzoomTransitionImageFastEnd).to.be.true;
    expect(wrapper.vm.selectZoomAnimation.unzoomTransitionImageFast).to.be.false;
    wrapper.vm.$data.step = 1;
    wrapper.vm.$data.zoomingStep = 1;
    expect(wrapper.vm.selectZoomAnimation.zoomTransitionImageFast).to.be.false;
    expect(wrapper.vm.selectZoomAnimation.zoomTransitionImageMedium).to.be.false;
    expect(wrapper.vm.selectZoomAnimation.zoomTransitionImageSlow).to.be.false;
    expect(wrapper.vm.selectZoomAnimation.unzoomTransitionImageFastEnd).to.be.false;
    expect(wrapper.vm.selectZoomAnimation.unzoomTransitionImageFast).to.be.true;
    wrapper.vm.$data.step = 5;
    expect(wrapper.vm.selectZoomAnimation.zoomTransitionImageFast).to.be.false;
    expect(wrapper.vm.selectZoomAnimation.zoomTransitionImageMedium).to.be.false;
    expect(wrapper.vm.selectZoomAnimation.zoomTransitionImageSlow).to.be.false;
    expect(wrapper.vm.selectZoomAnimation.unzoomTransitionImageFastEnd).to.be.false;
    expect(wrapper.vm.selectZoomAnimation.unzoomTransitionImageFast).to.be.true;
  });

  it("Test component initialisation", () => {
    expect(wrapper.vm.$data.step).to.equals(3);
    expect($store.dispatch.callCount).to.equals(1);
  });

<<<<<<< HEAD
  it("Test movement analyzer", () => {
    wrapper.vm.$data.releaseStep = 0;
    wrapper.vm.$data.zoomingStep = -1;
    wrapper.vm.animationStepAnalysis(false, true, false);
    expect(wrapper.vm.$data.releaseStep).to.equals(0);
    expect(wrapper.vm.$data.zoomingStep).to.equals(-1);
    wrapper.vm.animationStepAnalysis(true, false, false);
    expect(wrapper.vm.$data.releaseStep).to.equals(0);
    expect(wrapper.vm.$data.zoomingStep).to.equals(-1);
    wrapper.vm.animationStepAnalysis(true, true, false);
    expect(wrapper.vm.$data.releaseStep).to.equals(-1);
    expect(wrapper.vm.$data.zoomingStep).to.equals(2);
    wrapper.vm.$data.releaseStep = 0;
    wrapper.vm.$data.zoomingStep = -1;
    wrapper.vm.animationStepAnalysis(true, false, true);
    expect(wrapper.vm.$data.releaseStep).to.equals(0);
    expect(wrapper.vm.$data.zoomingStep).to.equals(1);
  });

  it("Test releaseSlider method", () => {
=======
  it("Test rangeChange method", () => {
    wrapper.vm.$data.data = [];
    wrapper.vm.$data.data.push(new ImageData("1", "Title 1", "Author 1", "Medium 1", "Link 1", "Subject 1"))
>>>>>>> ef7d54ae76569000e3d1889fd78dc95461dcc7b7
    wrapper.vm.$data.zoomingStep = 6;
    wrapper.vm.$data.step = 6;
    expect(wrapper.vm.$data.releaseStep).to.equal(-1);
    expect(wrapper.vm.$data.step).to.equals(6);
    expect(wrapper.vm.$data.zoomingStep).to.equals(6);
    wrapper.vm.releaseSlider(2);
    expect(wrapper.vm.$data.step).to.equals(3);
    expect(wrapper.vm.$data.zoomingStep).to.equals(2);
    expect(wrapper.vm.$data.releaseStep).to.equal(2);
  });

  it("Test changeImage call loading method", () => {
    sandbox.stub(wrapper.vm, "navigateNextImage").callsFake(() => {
      return;
    });
    sandbox.stub(wrapper.vm, "stopChangeImageTimeout").callsFake(() => {
      return;
    });
    sandbox.stub(wrapper.vm, "navigatePreviousImage").callsFake(() => {
      return;
    });
    sandbox.stub(wrapper.vm, "stopDisplayRelatedImages").callsFake(() => {
      return;
    })
    sandbox.spy(wrapper.vm.navigateNextImage);
    sandbox.spy(wrapper.vm.stopTimeout);
    sandbox.spy(wrapper.vm.navigatePreviousImage);
    wrapper.vm.$data.step = -1;
    wrapper.vm.changeImage(4);
    expect(wrapper.vm.navigateNextImage.callCount).to.equal(0);
    expect(wrapper.vm.stopChangeImageTimeout.callCount).to.equal(0);
    expect(wrapper.vm.stopDisplayRelatedImages.callCount).to.equal(1);
    expect(wrapper.vm.navigatePreviousImage.callCount).to.equal(0);
    wrapper.vm.$data.step = 0;
    wrapper.vm.changeImage(4);
    expect(wrapper.vm.navigateNextImage.callCount).to.equal(1);
    expect(wrapper.vm.stopChangeImageTimeout.callCount).to.equal(0);
    expect(wrapper.vm.stopDisplayRelatedImages.callCount).to.equal(2);
    expect(wrapper.vm.navigatePreviousImage.callCount).to.equal(0);
    wrapper.vm.$data.step = 1;
    wrapper.vm.changeImage(4);
    expect(wrapper.vm.navigateNextImage.callCount).to.equal(2);
    expect(wrapper.vm.stopChangeImageTimeout.callCount).to.equal(0);
    expect(wrapper.vm.stopDisplayRelatedImages.callCount).to.equal(3);
    expect(wrapper.vm.navigatePreviousImage.callCount).to.equal(0);
    wrapper.vm.$data.step = 2;
    wrapper.vm.changeImage(4);
    expect(wrapper.vm.navigateNextImage.callCount).to.equal(3);
    expect(wrapper.vm.stopChangeImageTimeout.callCount).to.equal(0);
    expect(wrapper.vm.stopDisplayRelatedImages.callCount).to.equal(4);
    expect(wrapper.vm.navigatePreviousImage.callCount).to.equal(0);
    wrapper.vm.$data.step = 3;
    wrapper.vm.changeImage(4);
    expect(wrapper.vm.navigateNextImage.callCount).to.equal(3);
    expect(wrapper.vm.stopChangeImageTimeout.callCount).to.equal(1);
    expect(wrapper.vm.stopDisplayRelatedImages.callCount).to.equal(5);
    expect(wrapper.vm.navigatePreviousImage.callCount).to.equal(0);
    wrapper.vm.$data.step = 4;
    wrapper.vm.changeImage(4);
    expect(wrapper.vm.navigateNextImage.callCount).to.equal(3);
    expect(wrapper.vm.stopChangeImageTimeout.callCount).to.equal(1);
    expect(wrapper.vm.stopDisplayRelatedImages.callCount).to.equal(6);
    expect(wrapper.vm.navigatePreviousImage.callCount).to.equal(1);
    wrapper.vm.$data.step = 5;
    wrapper.vm.changeImage(4);
    expect(wrapper.vm.navigateNextImage.callCount).to.equal(3);
    expect(wrapper.vm.stopChangeImageTimeout.callCount).to.equal(1);
    expect(wrapper.vm.stopDisplayRelatedImages.callCount).to.equal(7);
    expect(wrapper.vm.navigatePreviousImage.callCount).to.equal(2);
    wrapper.vm.$data.step = 6;
    wrapper.vm.changeImage(4);
    expect(wrapper.vm.navigateNextImage.callCount).to.equal(3);
    expect(wrapper.vm.stopChangeImageTimeout.callCount).to.equal(1);
    expect(wrapper.vm.stopDisplayRelatedImages.callCount).to.equal(8);
    expect(wrapper.vm.navigatePreviousImage.callCount).to.equal(3);
    wrapper.vm.$data.step = 7;
    wrapper.vm.changeImage(4);
    expect(wrapper.vm.navigateNextImage.callCount).to.equal(3);
    expect(wrapper.vm.stopChangeImageTimeout.callCount).to.equal(1);
    expect(wrapper.vm.stopDisplayRelatedImages.callCount).to.equal(9);
    expect(wrapper.vm.navigatePreviousImage.callCount).to.equal(3);
  });

  it("Test animation step management", () => {
    sandbox.stub(wrapper.vm, "navigateNextImage").callsFake(() => {
      return;
    });
    sandbox.stub(wrapper.vm, "stopChangeImageTimeout").callsFake(() => {
      return;
    });
    sandbox.stub(wrapper.vm, "navigatePreviousImage").callsFake(() => {
      return;
    });

    wrapper.vm.$data.zoomingStep = -1;
    wrapper.vm.$data.step = 0;
    wrapper.vm.$data.previousStep = 1;
    wrapper.vm.changeImage(4);
    expect(wrapper.vm.$data.zoomingStep).to.equal(2);
    expect(wrapper.vm.$data.previousStep).to.equal(0);
    wrapper.vm.$data.zoomingStep = -1;
    wrapper.vm.$data.previousStep = 0;
    wrapper.vm.changeImage(4);
    expect(wrapper.vm.$data.zoomingStep).to.equal(-1);
    expect(wrapper.vm.$data.previousStep).to.equal(0);
    wrapper.vm.$data.step = 1;
    wrapper.vm.$data.previousStep = 0;
    wrapper.vm.$data.zoomingStep = -1;
    wrapper.vm.changeImage(4);
    expect(wrapper.vm.$data.zoomingStep).to.equal(1);
    expect(wrapper.vm.$data.previousStep).to.equal(1);
    wrapper.vm.$data.previousStep = 2;
    wrapper.vm.$data.zoomingStep = -1;
    wrapper.vm.changeImage(4);
    expect(wrapper.vm.$data.zoomingStep).to.equal(2);
    expect(wrapper.vm.$data.previousStep).to.equal(1);
    wrapper.vm.$data.previousStep = 1;
    wrapper.vm.$data.zoomingStep = -1;
    wrapper.vm.changeImage(4);
    expect(wrapper.vm.$data.zoomingStep).to.equal(-1);
    expect(wrapper.vm.$data.previousStep).to.equal(1);
    wrapper.vm.$data.step = 2;
    wrapper.vm.$data.previousStep = 2;
    wrapper.vm.$data.zoomingStep = -1;
    wrapper.vm.changeImage(4);
    expect(wrapper.vm.$data.zoomingStep).to.equal(-1);
    expect(wrapper.vm.$data.previousStep).to.equal(2);
    wrapper.vm.$data.previousStep = 1;
    wrapper.vm.$data.zoomingStep = -1;
    wrapper.vm.changeImage(4);
    expect(wrapper.vm.$data.zoomingStep).to.equal(1);
    expect(wrapper.vm.$data.previousStep).to.equal(2);
    wrapper.vm.$data.previousStep = 3;
    wrapper.vm.$data.zoomingStep = -1;
    wrapper.vm.changeImage(4);
    expect(wrapper.vm.$data.zoomingStep).to.equal(2);
    expect(wrapper.vm.$data.previousStep).to.equal(2);
    wrapper.vm.$data.step = 3;
    wrapper.vm.$data.previousStep = 3;
    wrapper.vm.$data.zoomingStep = -1;
    wrapper.vm.changeImage(4);
    expect(wrapper.vm.$data.zoomingStep).to.equal(-1);
    expect(wrapper.vm.$data.previousStep).to.equal(3);
    wrapper.vm.$data.previousStep = 2;
    wrapper.vm.$data.zoomingStep = -1;
    wrapper.vm.changeImage(4);
    expect(wrapper.vm.$data.zoomingStep).to.equal(-1);
    expect(wrapper.vm.$data.previousStep).to.equal(3);
    wrapper.vm.$data.previousStep = 4;
    wrapper.vm.$data.zoomingStep = -1;
    wrapper.vm.changeImage(4);
    expect(wrapper.vm.$data.zoomingStep).to.equal(-1);
    expect(wrapper.vm.$data.previousStep).to.equal(3);
    wrapper.vm.$data.step = 4;
    wrapper.vm.$data.previousStep = 4;
    wrapper.vm.$data.zoomingStep = -1;
    wrapper.vm.changeImage(4);
    expect(wrapper.vm.$data.zoomingStep).to.equal(-1);
    expect(wrapper.vm.$data.previousStep).to.equal(4);
    wrapper.vm.$data.previousStep = 3;
    wrapper.vm.$data.zoomingStep = -1;
    wrapper.vm.changeImage(4);
    expect(wrapper.vm.$data.zoomingStep).to.equal(2);
    expect(wrapper.vm.$data.previousStep).to.equal(4);
    wrapper.vm.$data.previousStep = 5;
    wrapper.vm.$data.zoomingStep = -1;
    wrapper.vm.changeImage(4);
    expect(wrapper.vm.$data.zoomingStep).to.equal(1);
    expect(wrapper.vm.$data.previousStep).to.equal(4);
    wrapper.vm.$data.step = 5;
    wrapper.vm.$data.previousStep = 5;
    wrapper.vm.$data.zoomingStep = -1;
    wrapper.vm.changeImage(4);
    expect(wrapper.vm.$data.zoomingStep).to.equal(-1);
    expect(wrapper.vm.$data.previousStep).to.equal(5);
    wrapper.vm.$data.previousStep = 4;
    wrapper.vm.$data.zoomingStep = -1;
    wrapper.vm.changeImage(4);
    expect(wrapper.vm.$data.zoomingStep).to.equal(2);
    expect(wrapper.vm.$data.previousStep).to.equal(5);
    wrapper.vm.$data.previousStep = 6;
    wrapper.vm.$data.zoomingStep = -1;
    wrapper.vm.changeImage(4);
    expect(wrapper.vm.$data.zoomingStep).to.equal(1);
    expect(wrapper.vm.$data.previousStep).to.equal(5);
    wrapper.vm.$data.step = 6;
    wrapper.vm.$data.previousStep = 6;
    wrapper.vm.$data.zoomingStep = -1;
    wrapper.vm.changeImage(4);
    expect(wrapper.vm.$data.zoomingStep).to.equal(-1);
    expect(wrapper.vm.$data.previousStep).to.equal(6);
    wrapper.vm.$data.previousStep = 5;
    wrapper.vm.$data.zoomingStep = -1;
    wrapper.vm.changeImage(4);
    expect(wrapper.vm.$data.zoomingStep).to.equal(2);
    expect(wrapper.vm.$data.previousStep).to.equal(6);
  });

it("Test getRelatedPositionItem method", () => {
  wrapper.vm.$data.relatedImagesPosition = [
    {
      position: 28,
      name: "test",
    },
    {
      position: 22,
      name: "Test 2",
    },
  ]
  expect(wrapper.vm.getRelatedPositionItem(22)).to.eql([{ position: 22, name: "Test 2"}]);
  expect(wrapper.vm.getRelatedPositionItem(99)).to.be.empty;
});
/*
  it("Test stopDisplayRelatedImages method", (done) => {
    wrapper.vm.$data.relatedImagesPosition = [1,2,3];
    wrapper.vm.$data.displayRelatedImageTimeout.push(setTimeout(() => null, 10000))
    wrapper.vm.$data.displayRelatedImageTimeout.push(setTimeout(() => null, 10000))
    wrapper.vm.stopDisplayRelatedImages().then(done);
    expect(wrapper.vm.$data.relatedImagesPosition).to.be.empty;
    expect(wrapper.vm.$data.displayRelatedImageTimeout).to.be.empty;
  });


  it("Test loadPreviousImages method", (done) => {
    sandbox.stub(wrapper.vm, "stopChangeImageTimeout").callsFake(() => {
      return;
    });
    let carousel = {
      prev: function() {
        console.log('TEST');
      },
    };
    wrapper.vm.$data.carousel = carousel;
    sandbox.spy(wrapper.vm.$data.carousel);
    wrapper.vm.$data.currentIndex = 0;
    wrapper.vm.navigatePreviousImage(0);
    expect(wrapper.vm.$data.carousel.prev.callCount).to.equal(0);
    wrapper.vm.$data.currentIndex = 1;
    wrapper.vm.navigatePreviousImage(0).then(done);
    expect(wrapper.vm.$data.carousel.prev.callCount).to.equal(1);
    wrapper.vm.navigatePreviousImage(0).then(done);
    expect(wrapper.vm.$data.carousel.prev.callCount).to.equal(1);
  });


  it("Test loadNextImages method", () => {
    let carousel = {
      next: function() {},
    };
    wrapper.vm.$data.carousel = carousel;
    sandbox.spy(wrapper.vm.$data.carousel);
    wrapper.vm.$data.currentSlide = 0;
    wrapper.vm.$data.totalCarouselIndex = 100;
    wrapper.vm.$data.isLoadingImage = true;
    wrapper.vm.loadNextImages(10, 95, 0);
    expect(wrapper.vm.$data.currentSlide).to.equal(10);
    expect(wrapper.vm.$data.carousel.next.callCount).to.equal(1);
    expect($store.dispatch.callCount).to.equals(1);
    
    wrapper.vm.$data.isLoadingImage = false;
    wrapper.vm.loadNextImages(10, 5, 0);
    expect(wrapper.vm.$data.currentSlide).to.equal(10);
    expect(wrapper.vm.$data.carousel.next.callCount).to.equal(2);
    expect($store.dispatch.callCount).to.equals(1);

    wrapper.vm.loadNextImages(10, 95, 0);
    expect(wrapper.vm.$data.currentSlide).to.equal(10);
    expect(wrapper.vm.$data.carousel.next.callCount).to.equal(3);
    expect($store.dispatch.callCount).to.equals(2);
  });
  */
});
