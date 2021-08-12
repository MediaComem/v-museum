import { expect } from "chai";
import { mutations } from "../../../src/main";

describe("mutations", () => {
  const state = {
    nextDecade: String,
    nextPageOffset: 1,
    images: [],
    relatedImages: [],
  };

  it("setNextDecade", () => {
    mutations.setNextDecade(state, "193");
    expect(state.nextDecade).to.equal("193");
  });

  it("setNextContext", () => {
    state.images = [1, 2, 3, 4];
    let array = [5, 6, 7, 8];
    let result = [1, 2, 3, 4, 5, 6, 7, 8];
    mutations.setNextContext(state, { images: array, page: 1000});
    expect(state.nextPageOffset).to.equal(1000);
    expect(state.images).to.eql(result);
  });

  it("provideRelatedImages", () => {
    let result = [1,2,3];
    mutations.provideRelatedImages(state, [1,2,3]);
    expect(state.relatedImages).to.eql(result);
  })
});
