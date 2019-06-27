import React from 'react';

const sin45 = Math.cos(45 * Math.PI / 180) * 2;

const Dot = ({cx, cy, scale, ...restProps}) => (
  <circle cx={cx / scale} cy={cy / scale} r={0.5 / sin45 / scale} {...restProps} />
);

export default Dot;
