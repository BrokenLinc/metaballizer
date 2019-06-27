import React from 'react';

const Dot = ({cx, cy, scale, ...restProps}) => (
  <circle cx={cx / scale} cy={cy / scale} r={0.5 / 1.44 / scale} {...restProps} />
);

export default Dot;
