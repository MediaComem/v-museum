import { expect } from "chai";
import sinon from "sinon";
import axios from "axios";

import dataFetching from "../../../src/api/dataFetching";
import ImageData from "../../../src/models/ImageData";

const elements = [
  {
    "dcterms:identifier": [
      {
        type: "literal",
        property_id: 10,
        property_label: "Identifier",
        is_public: true,
        "@value": "1",
      },
    ],
    "dcterms:title": [
      {
        type: "literal",
        property_id: 1,
        property_label: "Title",
        is_public: true,
        "@value": "Title 1",
      },
    ],
    "dcterms:creator": [
      {
        type: "literal",
        property_id: 1,
        property_label: "Author 1",
        is_public: true,
        "@value": "Author 1",
      },
    ],
    "dcterms:medium": [
      {
        type: "literal",
        property_id: 1,
        property_label: "Medium 1",
        is_public: true,
        "@value": "Medium 1",
      },
    ],
    thumbnail_display_urls: "Link 1",
    "dcterms:subject": "Subject 1",
  },
  {
    "dcterms:identifier": [
      {
        type: "literal",
        property_id: 10,
        property_label: "Identifier",
        is_public: true,
        "@value": "2",
      },
    ],
    thumbnail_display_urls: "Link 2",
    "dcterms:creator": [
      {
        type: "literal",
        property_id: 1,
        property_label: "Author 2",
        is_public: true,
        "@value": "Author 2",
      },
    ],
    "dcterms:medium": [
      {
        type: "literal",
        property_id: 1,
        property_label: "Medium 2",
        is_public: true,
        "@value": "Medium 2",
      },
    ],
    "dcterms:subject": "Subject 2",
  },
];

describe("Test API that retrieve the data", () => {
  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  it("Test getRelatedImages method without data", () => {
    sandbox.stub(axios, "get").callsFake(
      () =>
        new Promise((success) => {
          success({
            headers: { "omeka-s-total-results": "" },
            data: [],
          });
        })
    );
    const result = dataFetching.getRelatedImages("test");
    return result.then((val) => {
      expect(val).to.be.undefined;
    });
  });

  it("Test getRelatedImages method with data", () => {
    sandbox.stub(axios, "get").callsFake(
      () =>
        new Promise((success) => {
          success({
            headers: { "omeka-s-total-results": "2" },
            data: elements,
          });
        })
    );
    const result = dataFetching.getRelatedImages("test");
    return result.then((val) => {
      expect(val.id).to.be.oneOf(["1", "2"]);
    });
  });

  it("Test getImages method without data", () => {
    sandbox.stub(axios, "get").callsFake(
      () =>
        new Promise((success) => {
          success({ data: [] });
        })
    );
    const result = dataFetching.getImages("191");
    return result.then((val) => {
      expect(val).to.eql([]);
    });
  });

  it("Test getImage with data to be parsed", () => {
    sandbox.stub(axios, "get").callsFake(
      () =>
        new Promise((success) => {
          success({
            data: elements,
          });
        })
    );
    const response = dataFetching.getImages("191");
    const expectedResult = [];
    expectedResult.push(
      new ImageData(
        "1",
        "Title 1",
        "Author 1",
        "Medium 1",
        "Link 1",
        "Subject 1"
      )
    );
    expectedResult.push(
      new ImageData("2", null, "Author 2", "Medium 2", "Link 2", "Subject 2")
    );
    return response.then((val) => {
      expect(val).to.eql(expectedResult);
    });
  });
});
