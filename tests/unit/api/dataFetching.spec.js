import { expect } from "chai";
import sinon from "sinon";
import axios from "axios";

import dataFetching from "../../../src/api/dataFetching";
import ImageData from "../../../src/models/ImageData";

describe("Test API that retrieve the data", () => {
  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  it("Test findNbItemsPerDecade method", () => {
    sandbox.stub(axios, "get").callsFake(
      () =>
        new Promise((success) => {
          success({ headers: {
            "omeka-s-total-results": 250
          }});
        })
    );
    const result = dataFetching.findNbItemsPerDecade("191");
    return result.then((val) => {
      expect(val).to.equals(250);
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
            data: [
              {
                "o:id": 1,
                "dcterms:title": [
                  {
                    type: "literal",
                    property_id: 1,
                    property_label: "Title",
                    is_public: true,
                    "@value": "Title 1",
                  },
                ],
                thumbnail_display_urls: "Link 1",
                "dcterms:subject": "Subject 1",
              },
              {
                "o:id": 2,
                thumbnail_display_urls: "Link 2",
                "dcterms:subject": "Subject 2",
              },
            ],
          });
        })
    );
    const response = dataFetching.getImages("191");
    const expectedResult = [];
    expectedResult.push(new ImageData(1, "Title 1", "Link 1", "Subject 1"));
    expectedResult.push(new ImageData(2, null, "Link 2", "Subject 2"));
    return response.then((val) => {
      expect(val).to.eql(expectedResult);
    });
  });
});
