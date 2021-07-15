import { expect } from "chai";
import { mutations } from "../../../src/main";

describe("mutations", () => {
  const state = {
    nbItemsLoadInThePast: 0,
    previousDecade: String,
    previousPageOffset: 1,
    nextDecade: String,
    nextPageOffset: 1,
    images: [],
  };

  it("setPreviousDecade", () => {
    mutations.setPreviousDecade(state, "193");
    expect(state.previousDecade).to.equal("193");
  });

  it("setPreviousPageOffset", () => {
    mutations.setPreviousPageOffset(state, 1000);
    expect(state.previousPageOffset).to.equal(1000);
  });

  it("setNextDecade", () => {
    mutations.setNextDecade(state, "193");
    expect(state.nextDecade).to.equal("193");
  });

  it("setPastContext", () => {
    state.images = [1, 2, 3, 4];
    let array = [5, 6, 7, 8];
    let result = [5, 6, 7, 8, 1, 2, 3, 4];
    mutations.setPastContext(state, { images: array, page: 1000});
    expect(state.nbItemsLoadInThePast).to.equal(4);
    expect(state.previousPageOffset).to.equal(1000);
    expect(state.images).to.eql(result);
  });

  it("setNextContext", () => {
    state.images = [1, 2, 3, 4];
    let array = [5, 6, 7, 8];
    let result = [1, 2, 3, 4, 5, 6, 7, 8];
    mutations.setNextContext(state, { images: array, page: 1000});
    expect(state.nextPageOffset).to.equal(1000);
    expect(state.images).to.eql(result);
  });
});
