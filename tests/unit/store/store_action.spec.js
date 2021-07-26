//import { expect } from "chai";
import sinon from "sinon";

import dataFetching from "../../../src/api/dataFetching";
import ImageData from "../../../src/models/ImageData";

import { actions } from "../../../src/main";

describe("Test vuex actions", () => {
  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  const state = {
    isLoadingImage: false,
    nextDecade: 0,
    nextPageOffset: 1,
    images: [],
    relatedImages: [],
  };

  // TODO: How to fix this test code
  it("Test initializeCarousel action", () => {
    const data = [];
    data.push(
      new ImageData(
        "1",
        "Title 1",
        "Author 1",
        "Medium 1",
        "Link 1",
        "Subject 1"
      )
    );
    data.push(
      new ImageData("2", null, "Author 2", "Medium 2", "Link 2", "Subject 2")
    );
    sandbox.stub(dataFetching, "getImages").callsFake(
      () =>
        new Promise((success) => {
          success({ data: data });
        })
    );
    const commit = sinon.spy();
    actions.initializeCarousel({ commit, state }, { decade: "191" });
    console.log(commit.args);
  });
});
