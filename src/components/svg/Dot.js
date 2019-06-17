import React from 'react';

const SUBPIXEL_KILLER = 1.02;

const Dot = ({cx, cy, scale, ...restProps}) => (
  <circle cx={cx / scale} cy={cy / scale} r={0.5 / 1.44 / scale * SUBPIXEL_KILLER} {...restProps} />
);

export default Dot;
