import {
  relatedThumbnailWidth,
  relatedThumbnailHeight,
} from './image_management_service';

const removeConstraintPositions = (currentPosition) => {
  switch (currentPosition) {
    case 1:
      return [1, 2, 3, 4, 5];
    case 2:
      return [1, 2, 3, 4, 6];
    case 3:
      return [1, 2, 3, 5, 6];
    case 4:
      return [1, 2, 4, 5, 6];
    case 5:
      return [1, 3, 4, 5, 6];
    case 6:
      return [2, 3, 4, 5, 6];
    default:
      return [1, 2, 3, 4, 5, 6];
  }
};

const generatePosition = (currentPosition) => {
  return removeConstraintPositions(currentPosition)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
};

const getIndicatorPosition = (
  imagePosition,
  screenPosition,
  windowHeight,
  windowWidth
) => {
  const cornerTopLeft = {
    left: imagePosition.left - screenPosition.left,
    top: imagePosition.top - screenPosition.top,
  };

  const centerImage = {
    left: cornerTopLeft.left - windowWidth / 2,
    top: cornerTopLeft.top - windowHeight / 2,
  };

  //find rotation
  let rotation = Math.atan2(centerImage.top, centerImage.left);
  rotation = Math.round((rotation * 180) / Math.PI);

  //find slope
  const slope = centerImage.top / centerImage.left;

  let padding = 0;
  let textRotation = 0;

  if (rotation > 0) {
    textRotation = 180;
  }

  //calculate indicator position
  let indicatorPos = {};
  if (centerImage.top < 0) {
    padding = 30;
    //top of screen
    indicatorPos = {
      left: -(windowHeight - padding) / 2 / slope,
      top: -(windowHeight - padding) / 2,
    };
  } else {
    padding = 180;
    // bottom of screen
    indicatorPos = {
      left: (windowHeight - padding) / 2 / slope,
      top: (windowHeight - padding) / 2,
    };
  }

  if (indicatorPos.left < -(windowWidth - 30) / 2) {
    padding = 30;
    //left side
    indicatorPos = {
      left: -(windowWidth - padding) / 2,
      top: (slope * -(windowWidth - padding)) / 2,
    };
  } else if (indicatorPos.left > (windowWidth - 30) / 2) {
    padding = 180;
    //right side
    indicatorPos = {
      left: (windowWidth - padding) / 2,
      top: (slope * (windowWidth - padding)) / 2,
    };
  }

  return {
    left: indicatorPos.left + screenPosition.left + windowWidth / 2,
    top: indicatorPos.top + screenPosition.top + windowHeight / 2,
    rotation: rotation,
    visible: true,
    textRotation: textRotation,
  };
};

const isOutsideViewPort = (
  window,
  imagePosition,
  centerLeftPosition,
  centerTopPosition,
  factor
) => {
  const cornerTopLeft = {
    top: centerTopPosition - window.innerHeight / 2,
    left: centerLeftPosition - window.innerWidth / 2,
  };
  const cornerBottomRight = {
    top: centerTopPosition + window.innerHeight / 2,
    left: centerLeftPosition + window.innerWidth / 2,
  };

  const imageWidth = relatedThumbnailWidth(factor);
  const imageHeight = relatedThumbnailHeight(factor);

  const imageCornerBottomLeft = {
    top: imagePosition.top + imageHeight,
    left: imagePosition.left + imageWidth,
  };

  if (
    imageCornerBottomLeft.top > cornerTopLeft.top &&
    imageCornerBottomLeft.left > cornerTopLeft.left &&
    imagePosition.top < cornerBottomRight.top &&
    imagePosition.left < cornerBottomRight.left
  ) {
    return false;
  } else {
    return true;
  }
};

export { generatePosition, isOutsideViewPort, getIndicatorPosition };
