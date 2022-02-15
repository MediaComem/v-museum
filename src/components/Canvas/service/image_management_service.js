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
    case width >= 1600 && height >= 1550:
      return {sizeFactor: 10, moveWidthFactor: 2.8, moveTopHeightFactor: 1.2, moveBottomHeightFactor: 1.7, moveCentralHeightFactor: 15};
    case width >= 1400 && height >= 1350:
      return {sizeFactor: 10, moveWidthFactor: 4, moveTopHeightFactor: 12, moveBottomHeightFactor: 8, moveCentralHeightFactor: 3};
    case width >= 1200 && height >= 1150:
      return {sizeFactor: 10, moveWidthFactor: 2.6, moveTopHeightFactor: 1.25, moveBottomHeightFactor: 1.5, moveCentralHeightFactor: 10};
    case width >= 1000 && height >= 920:
      return {sizeFactor: 10, moveWidthFactor: 2.4, moveTopHeightFactor: 1.4, moveBottomHeightFactor: 1.6, moveCentralHeightFactor: 12};
    case width >= 700 && height >= 716:
      return {sizeFactor: 7, moveWidthFactor: 2.1, moveTopHeightFactor: 1.3, moveBottomHeightFactor: 1.6, moveCentralHeightFactor: 14};
    case width >= 550 && height >= 615:
      return {sizeFactor: 5.5, moveWidthFactor: 1.9, moveTopHeightFactor: 1.35, moveBottomHeightFactor: 1.6, moveCentralHeightFactor: 12};
    case width >= 400 && height >= 514:
      return {sizeFactor: 4.5, moveWidthFactor: 1.6, moveTopHeightFactor: 1.35, moveBottomHeightFactor: 1.6, moveCentralHeightFactor: 10};
    case width >= 350 && height >= 480:
      return {sizeFactor: 3.5, moveWidthFactor: 1.6, moveTopHeightFactor: 1.4, moveBottomHeightFactor: 1.6, moveCentralHeightFactor: 10};
    default:
      return {sizeFactor: 3, moveWidthFactor: 1.5, moveTopHeightFactor: 1.5, moveBottomHeightFactor: 1.5, moveCentralHeightFactor: 10};
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
