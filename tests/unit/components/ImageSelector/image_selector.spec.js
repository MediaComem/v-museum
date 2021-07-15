import { shallowMount } from "@vue/test-utils";
import { expect } from "chai";
import sinon from "sinon";

import ImageSelector from "../../../../src/components/ImageSelector/ImageSelector.vue";

describe("Test ImageSelector component", () => {
  const sandbox = sinon.createSandbox();
  const $store = {
    state: {
      navPrevSize: 0,
      navPrevDecade: String,
      navPrevOffset: 1,
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
      },
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("Test component initialisation", () => {
    expect(wrapper.vm.$data.step).to.equals(3);
    expect($store.dispatch.callCount).to.equals(1);
  });

  it("Test rangeChange method", () => {
    wrapper.vm.$data.step = 6;
    expect(wrapper.vm.$data.step).to.equals(6);
    wrapper.vm.rangeChange();
    expect(wrapper.vm.$data.step).to.equals(3);
  });

  it("Test getPreviousImages method without loading new content", () => {

  });
});
