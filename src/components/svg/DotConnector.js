import React from 'react';
import { withPropsOnChange } from 'recompose';

const pathDataHorizontal = [
  'M0,0',
  'c27.61,27.61 72.39,27.61 100,0',
  'l0,100',
  'c-27.61,-27.61 -72.39,-27.61 -100,0',
  'l0,-100',
  'z',
].join('');

const pathDataVertical = [
  'M0,0',
  'l100,0',
  'c-27.61,27.61 -27.61,72.39 0,100',
  'l-100,0',
  'c27.61,-27.61 27.61,-72.39 0,-100',
  'z',
].join('');

const enhance = withPropsOnChange(['direction'], ({direction}) => {
  if (direction === 'up') {
    return {
      offsetX: -0.25,
      offsetY: -0.75,
      pathData: pathDataVertical,
    };
  }
  if (direction === 'down') {
    return {
      offsetX: -0.25,
      offsetY: 0.25,
      pathData: pathDataVertical,
    };
  }
  if (direction === 'left') {
    return {
      offsetX: -0.75,
      offsetY: -0.25,
      pathData: pathDataHorizontal,
    };
  }
  if (direction === 'right') {
    return {
      offsetX: 0.25,
      offsetY: -0.25,
      pathData: pathDataHorizontal,
    };
  }
});

const DotConnector = ({cx, cy, direction, offsetX, offsetY, pathData, scale, ...restProps}) => (
  <path
    d={pathData}
    transform={`translate(${(cx + offsetX) / scale}, ${(cy + offsetY) / scale}) scale(${0.5 / 100 / scale})`}
    {...restProps}
  />
);

export default enhance(DotConnector);
