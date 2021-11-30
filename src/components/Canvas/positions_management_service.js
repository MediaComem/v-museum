const potentialPositions = [1, 2, 3, 4, 5, 6];

const generatePosition = () => {
  return potentialPositions.sort(() => Math.random() - 0.5).slice(0, 3);
};

export {
    generatePosition
}