import RelatedImage from "./RelatedImage";

export default class ImageBlock {
    constructor(centralImageTopPosition, centralImageLeftPosition, imagePositions, relatedImages) {
        this.centralImageTopPosition = centralImageTopPosition;
        this.centralImageLeftPosition = centralImageLeftPosition;
        this.imagePositions = imagePositions;
        this.relatedImages = [];
        relatedImages.forEach(relatedImage => {
            this.relatedImages.push(new RelatedImage(relatedImage));
        })
    }
  }
  