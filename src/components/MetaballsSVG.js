import React from 'react';
import {map} from 'lodash';

import Dot from './Dot';
import DotConnector from './DotConnector';

const MetaballsSVG = ({width, height, circles, scale}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={`${width}px`}
    height={`${height}px`}
  >
    {map(circles, ({cx, cy, fill, hasDownConnector, hasRightConnector}, i) => {
      const shapeProps = {cx, cy, fill, scale};

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
  </svg>
);

export default MetaballsSVG;
