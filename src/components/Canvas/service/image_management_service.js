/*
  sizeFactor:               This is a factor to calculate the size of the image.
  moveWidthFactor:          This factor is used to calculate the distance on X axis between a related image and the central image.
  moveTopHeightFactor:      This factor is used to calculate the distance on Y axis between related image on top of the 
                            central image and the central image.
  moveBottomHeightFactor:   This factor is used to calculate the distance on Y axis between related image on bottom of the 
                            central image and the central image.
  moveCentralHeightFactor:  This factor is used to calculate the distance on Y axis between related image on same X axis than the 
                            central image and the central image.
*/
const getFactor = (height, width) => {
  switch (true) {
    case width >= 1600 && height >= 1600:
      return {sizeFactor: 10, moveWidthFactor: 2.7, moveTopHeightFactor: 2.1, moveBottomHeightFactor: 1.9, moveCentralHeightFactor: 1.9};
    case width >= 1000 && height >= 920:
      return {sizeFactor: 10, moveWidthFactor: 1.9, moveTopHeightFactor: 1.9, moveBottomHeightFactor: 1.9, moveCentralHeightFactor: 1.9};
    case width >= 700 && height >= 716:
      return {sizeFactor: 7, moveWidthFactor: 1.9, moveTopHeightFactor: 1.9, moveBottomHeightFactor: 1.9, moveCentralHeightFactor: 1.9};
    case width >= 550 && height >= 615:
      return {sizeFactor: 5.5, moveWidthFactor: 1.9, moveTopHeightFactor: 1.9, moveBottomHeightFactor: 1.9, moveCentralHeightFactor: 1.9};
    case width >= 400 && height >= 514:
      return {sizeFactor: 4.5, moveWidthFactor: 1.9, moveTopHeightFactor: 1.9, moveBottomHeightFactor: 1.9, moveCentralHeightFactor: 1.9};
    case width >= 350 && height >= 480:
      return {sizeFactor: 3.5, moveWidthFactor: 1.9, moveTopHeightFactor: 1.9, moveBottomHeightFactor: 1.9, moveCentralHeightFactor: 1.9};
    default:
      return {sizeFactor: 3, moveWidthFactor: 1.9, moveTopHeightFactor: 1.9, moveBottomHeightFactor: 1.9, moveCentralHeightFactor: 1.9};
  }
};

const thumbnailHeight = (factor) => {
  return 17 * 4 * factor;
};

const thumbnailWidth = (factor) => {
  return 9 * 4 * factor;
};

const relatedThumbnailHeight = (factor) => {
  return 9 * 4 * factor;
};

const relatedThumbnailWidth = (factor) => {
  return 8 * 4 * factor;
};

const getImageHeight = (hasFocus, imageFactor) => {
  return hasFocus
    ? thumbnailHeight(imageFactor)
    : relatedThumbnailHeight(imageFactor);
};

const getImageWidth = (hasFocus, imageFactor) => {
  return hasFocus
    ? thumbnailWidth(imageFactor)
    : relatedThumbnailWidth(imageFactor);
};

const isNewSelectedImage = (potentialImage, relatedImages) => {
  return (
    relatedImages.find((block) => block.centralId === potentialImage) ===
    undefined
  );
};

const isChangeSelectedImage = (potentialImage, relatedImages) => {
  return (
    relatedImages.find((element) => element.imageId === potentialImage) !==
    undefined
  );
};

const getNextIndexBaseOnState = (currentState) => {
  if (currentState === 0) {
    return 1;
  } else if (currentState === 1) {
    return 2;
  } else {
    return 0;
  }
};

const getPreviousIndexBaseOnState = (currentState) => {
  if (currentState === 0) {
    return 2;
  } else if (currentState === 1) {
    return 0;
  } else {
    return 1;
  }
};

const resetBlockFocus = (imageBlocks, imageId) => {
  imageBlocks.forEach((block) => {
    let shouldReset = false;
    block.relatedImages.find((element) => {
      if (element.imageId === imageId) {
        shouldReset = true;
      }
    });
    if (shouldReset) {
      block.relatedImages.forEach((element) => {
        element.wasSelected = false;
      });
    }
  });
};

const isFocusShouldHover = (imageBlocks) => {
  let value = false;
  imageBlocks.forEach((block) => {
    block.relatedImages.forEach((element) => { 
      if (element.hasFocus) {
        value = true;
      }
    })
  });
  return value;
};

export {
  getFactor,
  thumbnailHeight,
  thumbnailWidth,
  relatedThumbnailHeight,
  relatedThumbnailWidth,
  getImageHeight,
  getImageWidth,
  isNewSelectedImage,
  isChangeSelectedImage,
  getNextIndexBaseOnState,
  getPreviousIndexBaseOnState,
  resetBlockFocus,
  isFocusShouldHover,
};
