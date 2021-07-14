import { expect } from "chai";
import { mutations } from "../../../src/main";

describe("mutations", () => {
  const state = {
    navPrevSize: 0,
    navPrevDecade: String,
    navPrevOffset: 1,
    navNextDecade: String,
    navNextOffset: 1,
    images: [1,2,3,4],
  };

  it("setNavPrevSize", () => {
    mutations.setNavPrevSize(state, 1000);
    expect(state.navPrevSize).to.equal(1000);
  });

  it("setPreviousYear", () => {
    mutations.setPrevDecade(state, '193');
    expect(state.navPrevDecade).to.equal('193');
  });

  it("setPreviousOffset", () => {
    mutations.setPreviousOffset(state, 1000);
    expect(state.navPrevOffset).to.equal(1000);
  });

  it("setNextOffset", () => {
    mutations.setNextOffset(state, 1000);
    expect(state.navNextOffset).to.equal(1000);
  });

  it("setNextYear", () => {
    mutations.setNextDecade(state, '193');
    expect(state.navNextDecade).to.equal('193');
  });

  it("setPrevNavigation", () => {
    let array = [5,6,7,8];
    let result = [5,6,7,8,1,2,3,4];
    mutations.setPrevNavigation(state, array);
    expect(state.images).to.eql(result);
  });

  it("setNextNavigation", () => {
    let array = [5,6,7,8];
    let result = [5,6,7,8,1,2,3,4,5,6,7,8];
    mutations.setNextNavigation(state, array);
    expect(state.images).to.eql(result);
  });
});
