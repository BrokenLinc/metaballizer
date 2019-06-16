import React from 'react';
import { withPropsOnChange } from 'recompose';

const enhance = withPropsOnChange(['direction'], ({direction}) => {
  if (direction === 'up') {
    return {offsetX: -0.25, offsetY: -0.75};
  }
  if (direction === 'down') {
    return {offsetX: -0.25, offsetY: 0.25};
  }
  if (direction === 'left') {
    return {offsetX: -0.75, offsetY: -0.25};
  }
  if (direction === 'right') {
    return {offsetX: 0.25, offsetY: -0.25};
  }
});

const DotConnector = ({cx, cy, direction, offsetX, offsetY, scale, ...restProps}) => (
  <path
    d="M0,0c27.61,27.61 72.39,27.61 100,0c-27.61,27.61 -27.61,72.39 0,100c-27.61,-27.61 -72.39,-27.61 -100,0c27.61,-27.61 27.61,-72.39 0,-100z"
    style={{
      transform: `translate(${(cx + offsetX) / scale}px, ${(cy + offsetY) / scale}px) scale(${0.5 / 100 / scale})`,
    }}
    {...restProps}
  />
);

export default enhance(DotConnector);
