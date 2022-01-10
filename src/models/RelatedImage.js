export default class RelatedImage {
    constructor(relatedImage, position) {
        this.imageId = relatedImage.imageId;
        this.tag = relatedImage.tag;
        this.hasFocus = false;
        this.position = position;
        this.wasSelected = false;
    }
  }
  