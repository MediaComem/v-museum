const getFactor = (height, width) => {
    switch (true) {
        case width >= 1000 && height >= 920:
          return 10;
        case width >= 700 && height >= 716:
          return 7;
        case width >= 550 && height >= 615:
          return 5.5;
        case width >= 450 && height >= 548:
          return 4.5;
        case width >= 400 && height >= 514:
          return 4;
        case width >= 350 && height >= 480:
          return 3.5;
        default:
          return 3;
      }
}

const thumbnailHeight = (factor) => {
  return 17 * 4 * factor;
}

const thumbnailWidth = (factor) =>  {
  return 9 * 4 * factor;
}

const relatedThumbnailHeight = (factor) => {
  return 9 * 4 * factor;
}

const relatedThumbnailWidth = (factor) => {
  return 8 * 4 * factor;
}

const getImageHeight = (hasFocus, imageFactor) => {
  return hasFocus
    ? thumbnailHeight(imageFactor)
    : relatedThumbnailHeight(imageFactor);
}

const getImageWidth = (hasFocus, imageFactor) => {
  return hasFocus
    ? thumbnailWidth(imageFactor)
    : relatedThumbnailWidth(imageFactor);
}

const isNewSelectedImage = (potentialImage, relatedImages) => {
  return relatedImages.find(block => block.centralId === potentialImage) === undefined;
}

const isChangeSelectedImage = (potentialImage, relatedImages) => {
  const result = relatedImages.find(block => block.centralId === potentialImage) === undefined;
  const removeIndex = relatedImages.findIndex(block => block.relatedImages.find(relatedImage => relatedImage.imageId === potentialImage));
  if (result && removeIndex !== relatedImages.length - 1 && relatedImages.length > 1){
    return {
      shouldChange: true,
      index: removeIndex
    }
  }
  else {
    return {
      shouldChange: false,
      index: -1
    }
  }
  
}

export {
  getFactor,
  thumbnailHeight,
  thumbnailWidth,
  relatedThumbnailHeight,
  relatedThumbnailWidth,
  getImageHeight,
  getImageWidth,
  isNewSelectedImage,
  isChangeSelectedImage
} 