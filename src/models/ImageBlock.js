import RelatedImage from "./RelatedImage";

export default class ImageBlock {
  constructor(
    centralId,
    oldCentralImage,
    centralImagePosition,
    imagePositions,
    relatedImages
  ) {
    this.centralId = centralId;
    this.oldCentralImage = oldCentralImage;
    this.centralImagePosition = centralImagePosition;
    this.relatedImages = [];
    relatedImages.forEach((relatedImage, index) => {
      this.relatedImages.push(
        new RelatedImage(relatedImage, imagePositions[index])
      );
    });
  }
}
