import RelatedImage from "./RelatedImage";

export default class ImageBlock {
    constructor(centralId, oldCentralImage, centralImageTopPosition, centralImageLeftPosition, imagePositions, relatedImages) {
        this.centralId = centralId;
        this.oldCentralImage = oldCentralImage;
        this.centralImageTopPosition = centralImageTopPosition;
        this.centralImageLeftPosition = centralImageLeftPosition;
        this.imagePositions = imagePositions;
        this.relatedImages = [];
        relatedImages.forEach(relatedImage => {
            this.relatedImages.push(new RelatedImage(relatedImage));
        })
    }
  }
  