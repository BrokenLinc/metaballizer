const getPixel = (context, {x, y}) => {
  return context.getImageData(x, y, 1, 1).data;
};

const getPixelRGB = (context, {x, y}) => {
  const pixel = getPixel(context, {x, y});

  const red = pixel[0];
  const green = pixel[1];
  const blue = pixel[2];

  return {red, green, blue};
};

export default getPixelRGB;
