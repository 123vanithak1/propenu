import { useWindowDimensions } from 'react-native';

const useDimensions = () => {
  const { width, height } = useWindowDimensions();

  const isLandscape = width > height;
  const isPortrait = height >= width;

  return {
    width,
    height,
    isLandscape,
    isPortrait,
  };
};

export default useDimensions;
