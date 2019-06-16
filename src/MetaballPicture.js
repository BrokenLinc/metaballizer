import React from 'react';
import {
  defaultProps,
  compose,
  lifecycle,
  withHandlers,
  withPropsOnChange,
  withState,
  withStateHandlers
} from 'recompose';
import {each} from 'lodash';

import COLOR from './color';
import getPixelRGB from './getPixelRGB';
import getSVGImageSourceFromComponent from './getSVGImageSourceFromComponent';
import MetaballsSVG from './MetaballsSVG';

// config

// const hm = 0.2761; // 0 = square, 0.2761 = circle, 0.6 = diamond
// const s = 100; // grid size

// const connectorCurveSet = 'M3,0 H1,1 V-1,1 H-1,-1 V1,-1 Z M3,2 H1,1 V-1,1 H-1,-1 V1,-1';
//
// const COMMAND = {
//   M: (xm, ym) => `M${xm*s + s},${ym*s + s}`,
//   H: (xm, ym) => `c${hm*xm*s},${hm*ym*s} ${(1-hm)*xm*s},${hm*ym*s} ${xm*s},0`,
//   V: (xm, ym) => `c${hm*xm*s},${hm*ym*s} ${hm*xm*s},${(1-hm)*ym*s} 0,${ym*s}`,
//   Z: () => 'z ',
// };
//
// const getPathFromCurveSet = (curveSet) => {
//   let pathData = '';
//   const instructions = curveSet.split(' ');
//   for(let i in instructions) {
//     const cmd = instructions[i].substr(0,1);
//     const coords = instructions[i].substr(1).split(',');
//     pathData += COMMAND[cmd](...coords);
//   }
//   pathData += 'z';
//
//   return pathData;
// };

const enhance = compose(
  defaultProps({
    blueThreshold: 0.53,
    brightnessThreshold: 100,
    canvasRef: React.createRef(),
    connectorFrequency: 0.2,
    dotCount: 100,
    imageRef: React.createRef(),
    redThreshold: 0.61,
  }),
  withState('canvasContext', 'setCanvasContext'),
  withState('circles', 'setCircles'),
  withState('SVGImageSource', 'setSVGImageSource'),
  withStateHandlers({}, {
    setState: () => (newState) => (newState),
  }),
  withHandlers({
    drawShapes: (props) => (nextState) => {
      // merge nextState with props, to get the most up-to-date info
      const {
        blueThreshold,
        brightnessThreshold,
        canvasContext,
        connectorFrequency,
        height,
        redThreshold,
        scale,
        scaledHeight,
        scaledWidth,
        setCircles,
        setSVGImageSource,
        width,
      } = {...props, ...nextState};

      const circles = [];
      const grid = [];

      let colorScaleMin = 0;
      let colorScaleMax = 0;

      // sample pixels from canvas
      // add 0.6 offset to center dots on pixel grid
      for (let x = 0; x <= scaledWidth; x += 1) {
        grid[x] = [];
        for (let y = 0; y <= scaledHeight; y += 1) {
          const circle = {cx: x + 0.5, cy: y + 0.5};
          const {red, green, blue} = getPixelRGB(canvasContext, {x, y});

          // create dots for pixels that are bright enough
          if ((red + green + blue) / 3 > brightnessThreshold) {
            // find the colorScale, or how much more red or blue the pixel is
            const colorScale = red - blue;
            colorScaleMin = Math.min(colorScale, colorScaleMin);
            colorScaleMax = Math.max(colorScale, colorScaleMax);
            circle.colorScale = colorScale;

            // add the circle to the flat list
            circles.push(circle);
          }
          // add the circle to the grid lookup
          grid[x].push(circle);
        }
      }

      // map colorScale to fill by comparing it to the min/max values and thresholds
      each(circles, (circle) => {
        const relativeColorScale = (circle.colorScale - colorScaleMin) / (colorScaleMax - colorScaleMin);

        // TODO: store relativeColorScale and move the fill logic out to the render method
        if (relativeColorScale < blueThreshold) {
          circle.fill = COLOR.BLUE;
        } else if (relativeColorScale > redThreshold) {
          circle.fill = COLOR.RED;
        } else {
          circle.fill = COLOR.PURPLE;
        }
      });

      // run through grid and create connections between same-color dots
      for (let x = 0; x < grid.length - 1; x += 1) {
        for (let y = 0; y < grid[x].length - 1; y += 1) {
          const circle = grid[x][y];
          const circleRight = grid[x + 1][y];
          const circleDown = grid[x][y + 1];
          if (circle.fill === circleRight.fill && Math.random() < connectorFrequency) {
            circle.hasRightConnector = true;
          }
          if (circle.fill === circleDown.fill && Math.random() < connectorFrequency) {
            circle.hasDownConnector = true;
          }
        }
      }

      const metaballsProps = {width, height, circles, scale};
      const SVGImageSource = getSVGImageSourceFromComponent(<MetaballsSVG {...metaballsProps} />);

      setCircles(circles);
      setSVGImageSource(SVGImageSource);
    },
  }),
  withHandlers({
    handleFacetChange: (props) => () => {
      const {canvasContext, canvasRef, dotCount, drawShapes, imageRef, setState} = props;

      // if there is an image, update the canvas dimensions
      if (imageRef.current) {
        const {width, height} = imageRef.current.getBoundingClientRect();

        const scale = dotCount / width;
        const scaledWidth = width * scale;
        const scaledHeight = height * scale;

        // The canvas should have one pixel per metaball
        canvasRef.current.width = scaledWidth;
        canvasRef.current.height = Math.floor(scaledHeight);
        canvasContext.drawImage(imageRef.current, 0, 0, scaledWidth, scaledHeight);

        // set nextState and pass to drawShapes since setState is async
        const nextState = {scale, scaledWidth, scaledHeight, width, height};
        setState(nextState);
        drawShapes(nextState);
      }
    },
  }),
  // update artwork when input props change
  withPropsOnChange(
    ['blueThreshold', 'dotCount', 'redThreshold'],
    ({handleFacetChange}) => {
      handleFacetChange();
    },
  ),
  lifecycle({
    componentDidMount() {
      // store canvas context upon render
      const {canvasRef, setCanvasContext} = this.props;
      const context = canvasRef.current.getContext('2d');
      setCanvasContext(context);
    },
  }),
);

const MetaballPicture = ({canvasRef, handleFacetChange, imageRef, imageSrc, SVGImageSource}) => (
  <div className="metaball-picture">
    <img ref={imageRef} src={imageSrc} alt="source" onLoad={handleFacetChange} className="fill"/>
    <canvas ref={canvasRef} className="fill pixelated"/>
    <img src={SVGImageSource} alt="SVG output"/>
  </div>
);

export default enhance(MetaballPicture);
