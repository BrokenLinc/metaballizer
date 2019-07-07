const getSVGImageSourceFromString = (svgString) => {
  const encodedSVGString = encodeURIComponent(svgString);
  return `data:image/svg+xml;charset=utf-8,${encodedSVGString}`;
};

export default getSVGImageSourceFromString;
