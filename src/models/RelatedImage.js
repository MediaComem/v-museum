export default class RelatedImage {
    constructor(relatedImage, position, selected = false, hasFocus = false) {
        this.imageId = relatedImage.imageId;
        this.tag = relatedImage.tag;
        this.hasFocus = hasFocus;
        this.position = position;
        this.wasSelected = selected;
        this.shouldDisapear = false;
    }
  }
  