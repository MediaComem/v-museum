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

export { generatePosition };
