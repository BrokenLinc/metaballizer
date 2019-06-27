import React from 'react';
import {map} from 'lodash';

import Dot from './Dot';
import DotConnector from './DotConnector';

const Metaballs = ({width, height, circleGroups, scale}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={`${width}px`}
    height={`${height}px`}
  >
    {map(circleGroups, ({circles, paint}, j) => (
      <g key={j} opacity={paint.opacity}>
        {map(circles, ({cx, cy, color, hasDownConnector, hasRightConnector}, i) => {
          const shapeProps = {cx, cy, fill: color.hex, scale};

          return (
            <React.Fragment key={i}>
              <Dot {...shapeProps} />

              {hasDownConnector && (
                <DotConnector {...shapeProps} direction="down"/>
              )}

              {hasRightConnector && (
                <DotConnector {...shapeProps} direction="right"/>
              )}
            </React.Fragment>
          )
        })}
      </g>
    ))}
  </svg>
);

export default Metaballs;
