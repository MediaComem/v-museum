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
};
