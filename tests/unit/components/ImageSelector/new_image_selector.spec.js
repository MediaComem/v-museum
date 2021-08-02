import { shallowMount } from "@vue/test-utils";
import { expect } from "chai";
import sinon from "sinon";

import TestImageSelector from "../../../../src/components/ImageSelector/TestImageSelector.vue";

describe("Test ImageSelector component", () => {
  const sandbox = sinon.createSandbox();
  const $store = {
    state: {
      isLoadingImage: false,
      nextDecade: 0,
      nextPageOffset: 1,
      images: [],
    },
    dispatch: function() {},
  };

  let wrapper;
  beforeEach(() => {
    sandbox.spy($store);
    wrapper = shallowMount(TestImageSelector, {
      global: {
        mocks: {
          $store,
        },
      },
      config: {
        warnHandler: function(err, vm, info) {
          err = undefined;
          vm = undefined;
          info = undefined;
          return info;
        },
        errorHandler: function(err, vm, info) {
          err = undefined;
          vm = undefined;
          info = undefined;
          return info;
        },
      },
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("Test Stop Feature", () => {
    wrapper.vm.$data.step = 300;
    expect(wrapper.vm.isStop()).to.be.true;
    wrapper.vm.$data.step = 290;
    expect(wrapper.vm.isStop()).to.be.false;
    wrapper.vm.$data.step = 310;
    expect(wrapper.vm.isStop()).to.be.false;
  });

  it("Test loadMoreContent method", () => {
    wrapper.vm.$data.currentIndex = 0;
    wrapper.vm.$data.data = [];
    expect($store.dispatch.callCount).to.equals(1);
    wrapper.vm.loadMoreContent(80);
    expect($store.dispatch.callCount).to.equals(2);
    wrapper.vm.$data.data = [1];
    wrapper.vm.loadMoreContent(0);
    expect($store.dispatch.callCount).to.equals(2);
    // TODO: ADD part with the imageLoading
  });

  it("Test loop method", (done) => {
    wrapper.vm.$data.isLooped = false;
    wrapper.vm.loop(1, 3);
    setTimeout(() => {
      expect(wrapper.vm.$data.currentIndex).to.equals(4);
      done();
    }, 200);
  });

  it("Test move method", () => {
    sandbox.stub(wrapper.vm, "loadMoreContent").callsFake(() => {
      return;
    });
    sandbox.stub(wrapper.vm, "loop").callsFake(() => {
      return;
    });

    wrapper.vm.$data.currentIndex = 0;
    wrapper.vm.$data.data = [1];
    wrapper.vm.move(true);
    expect(wrapper.vm.loop.callCount).to.equals(1);
    wrapper.vm.$data.data = [1, 2, 3, 4, 5, 6];
    wrapper.vm.move(true);
    expect(wrapper.vm.loop.callCount).to.equals(1);
    expect(wrapper.vm.$data.currentIndex).to.equals(1);
    wrapper.vm.$data.currentIndex = 0;
    wrapper.vm.move(false);
    expect(wrapper.vm.loop.callCount).to.equals(2);
    wrapper.vm.$data.currentIndex = 50;
    wrapper.vm.move(false);
    expect(wrapper.vm.$data.currentIndex).to.equals(49);
    sandbox.restore();
  });

  it("Test movementAnalysis without move", () => {
    sandbox.stub(wrapper.vm, "stopInterval").callsFake(() => {
      return;
    });
    wrapper.vm.$data.previousSpeed = 6000;
    wrapper.vm.$data.previousDirection = false;
    wrapper.vm.movementAnalysis(6000, false);
    expect(wrapper.vm.stopInterval.callCount).to.equals(0);
  });

  it("Test movementAnalysis with movement through direction parameter", () => {
    sandbox.stub(wrapper.vm, "loadMoreContent").callsFake(() => {
      return;
    });
    sandbox.stub(wrapper.vm, "stopInterval").callsFake(() => {
      return;
    });
    sandbox.stub(wrapper.vm, "move").callsFake(() => {
      wrapper.vm.$data.currentIndex = wrapper.vm.$data.currentIndex + 1;
      return;
    });
    wrapper.vm.$data.currentIndex = 0;
    wrapper.vm.$data.interval = [];
    wrapper.vm.$data.timeout = undefined;
    wrapper.vm.$data.previousSpeed = 190;
    wrapper.vm.$data.previousDirection = false;
    wrapper.vm.movementAnalysis(190, true);
    expect(wrapper.vm.stopInterval.callCount).to.equals(1);
    expect(wrapper.vm.$data.interval.length).to.equals(1);
    expect(wrapper.vm.$data.timeout).to.exist;
  });

  it("Test movementAnalysis with movement through speed parameter", () => {
    sandbox.stub(wrapper.vm, "loadMoreContent").callsFake(() => {
      return;
    });
    sandbox.stub(wrapper.vm, "stopInterval").callsFake(() => {
      return;
    });
    sandbox.stub(wrapper.vm, "move").callsFake(() => {
      wrapper.vm.$data.currentIndex = wrapper.vm.$data.currentIndex + 1;
      return;
    });
    wrapper.vm.$data.currentIndex = 0;
    wrapper.vm.$data.previousSpeed = 0;
    wrapper.vm.$data.previousDirection = false;
    wrapper.vm.movementAnalysis(190, false);
    expect(wrapper.vm.stopInterval.callCount).to.equals(1);
    expect(wrapper.vm.$data.interval.length).to.equals(1);
    expect(wrapper.vm.$data.timeout).to.exist;
  });

  it("Test sliderChange method with no move position", () => {
    wrapper.vm.$data.step = 300;
    wrapper.vm.$data.timeout = undefined;
    wrapper.vm.sliderChange();
    expect(wrapper.vm.$data.timeout).to.exist;
  });

  it("Test slideChange method with movement", () => {
    sandbox.stub(wrapper.vm, "speedSelection").callsFake(() => {
      return 50;
    });
    sandbox.stub(wrapper.vm, "animationStepAnalysis").callsFake(() => {
      return;
    });
    sandbox.stub(wrapper.vm, "movementAnalysis").callsFake(() => {
      return;
    });

    wrapper.vm.$data.step = 20;
    wrapper.vm.sliderChange();
    expect(wrapper.vm.speedSelection.callCount).to.equals(1);
    expect(wrapper.vm.animationStepAnalysis.callCount).to.equals(1);
    expect(wrapper.vm.movementAnalysis.callCount).to.equals(1);
    expect(wrapper.vm.$data.previousSpeed).to.equals(50);
    expect(wrapper.vm.$data.previousDirection).to.be.true;

    wrapper.vm.$data.step = 500;
    wrapper.vm.sliderChange();
    expect(wrapper.vm.speedSelection.callCount).to.equals(2);
    expect(wrapper.vm.animationStepAnalysis.callCount).to.equals(2);
    expect(wrapper.vm.movementAnalysis.callCount).to.equals(2);
    expect(wrapper.vm.$data.previousSpeed).to.equals(50);
    expect(wrapper.vm.$data.previousDirection).to.be.false;
  });

  it("Test releaseSlider method without reset animation", () => {
    sandbox.stub(wrapper.vm, "stopInterval").callsFake(() => {
      return;
    });
    sandbox.stub(wrapper.vm, "getBackPreviousPosition").callsFake(() => {
      return;
    });

    wrapper.vm.$data.interval = [];
    wrapper.vm.$data.releaseStep = 2000;
    wrapper.vm.$data.step = 600;
    wrapper.vm.$data.zoomingStep = 7;
    wrapper.vm.$data.speed = 3000;
    wrapper.vm.$data.previousSpeed = 3000;
    wrapper.vm.$data.previousDirection = true;
    wrapper.vm.releaseSlider(300);
    expect(wrapper.vm.$data.releaseStep).to.equals(2000);
    expect(wrapper.vm.$data.step).to.equals(300);
    expect(wrapper.vm.$data.zoomingStep).to.equals(-1);
    expect(wrapper.vm.$data.speed).to.equals(6000);
    expect(wrapper.vm.$data.previousSpeed).to.equals(0);
    expect(wrapper.vm.$data.previousDirection).to.be.undefined;
    expect(wrapper.vm.stopInterval.callCount).to.equals(1);
    expect(wrapper.vm.getBackPreviousPosition.callCount).to.equals(1);
  });

  it("Test releaseSlider method with reset animation forward", () => {
    sandbox.stub(wrapper.vm, "stopInterval").callsFake(() => {
      return;
    });
    sandbox.stub(wrapper.vm, "getBackPreviousPosition").callsFake(() => {
      return;
    });

    wrapper.vm.$data.interval = [];
    wrapper.vm.$data.releaseStep = 2000;
    wrapper.vm.$data.step = 600;
    wrapper.vm.$data.zoomingStep = 7;
    wrapper.vm.$data.speed = 3000;
    wrapper.vm.$data.previousSpeed = 3000;
    wrapper.vm.$data.previousDirection = true;
    wrapper.vm.releaseSlider(50);
    expect(wrapper.vm.$data.releaseStep).to.equals(0);
    expect(wrapper.vm.$data.step).to.equals(300);
    expect(wrapper.vm.$data.zoomingStep).to.equals(-1);
    expect(wrapper.vm.$data.speed).to.equals(6000);
    expect(wrapper.vm.$data.previousSpeed).to.equals(0);
    expect(wrapper.vm.$data.previousDirection).to.be.undefined;
    expect(wrapper.vm.stopInterval.callCount).to.equals(1);
    expect(wrapper.vm.getBackPreviousPosition.callCount).to.equals(1);
  });

  it("Test releaseSlider method with reset animation backward", () => {
    sandbox.stub(wrapper.vm, "stopInterval").callsFake(() => {
      return;
    });
    sandbox.stub(wrapper.vm, "getBackPreviousPosition").callsFake(() => {
      return;
    });

    wrapper.vm.$data.interval = [];
    wrapper.vm.$data.releaseStep = 2000;
    wrapper.vm.$data.step = 600;
    wrapper.vm.$data.zoomingStep = 7;
    wrapper.vm.$data.speed = 3000;
    wrapper.vm.$data.previousSpeed = 3000;
    wrapper.vm.$data.previousDirection = true;
    wrapper.vm.releaseSlider(550);
    expect(wrapper.vm.$data.releaseStep).to.equals(0);
    expect(wrapper.vm.$data.step).to.equals(300);
    expect(wrapper.vm.$data.zoomingStep).to.equals(-1);
    expect(wrapper.vm.$data.speed).to.equals(6000);
    expect(wrapper.vm.$data.previousSpeed).to.equals(0);
    expect(wrapper.vm.$data.previousDirection).to.be.undefined;
    expect(wrapper.vm.stopInterval.callCount).to.equals(1);
    expect(wrapper.vm.getBackPreviousPosition.callCount).to.equals(1);
  });

  it("Test animationStepAnalysis method", () => {
    wrapper.vm.$data.data = [];
    wrapper.vm.$data.previousSpeed = 3000;
    wrapper.vm.$data.speed = 1500;
    wrapper.vm.$data.releaseStep = 5;
    wrapper.vm.$data.zoomingStep = 5;
    wrapper.vm.animationStepAnalysis(1500);
    expect(wrapper.vm.$data.releaseStep).to.equals(-1);
    expect(wrapper.vm.$data.zoomingStep).to.equals(2);
    wrapper.vm.$data.previousSpeed = 50;
    wrapper.vm.$data.speed = 250;
    wrapper.vm.animationStepAnalysis(250);
    expect(wrapper.vm.$data.releaseStep).to.equals(-1);
    expect(wrapper.vm.$data.zoomingStep).to.equals(1);
    wrapper.vm.$data.previousSpeed = 1500;
    wrapper.vm.$data.speed = 2000;
    wrapper.vm.animationStepAnalysis(2000);
    expect(wrapper.vm.$data.releaseStep).to.equals(-1);
    expect(wrapper.vm.$data.zoomingStep).to.equals(2);
  });
});
