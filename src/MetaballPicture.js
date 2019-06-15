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
import {each, map} from 'lodash';

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

const getPixel = (context, {x, y}) => {
  return context.getImageData(x, y, 1, 1).data;
};

function getCursorPosition(element, event) {
  const rect = element.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  return {x, y};
}

const MetaballPicture = compose(
  defaultProps({
    circleRadius: 10,
  }),
  withState('canvasContext', 'setCanvasContext'),
  withState('circles', 'setCircles', []),
  withStateHandlers({}, {
    setSize: () => (newState) => (newState),
  }),
  withPropsOnChange([], () => ({
    canvasRef: React.createRef(),
    imageRef: React.createRef(),
  })),
  withHandlers({
    drawShapes: ({canvasContext, circleRadius, setCircles, width: _width, height: _height}) => (params = {}) => {
      const circles = [];
      const grid = [];
      const width = _width || params.width;
      const height = _height || params.height;

      let colorScaleMin = 0;
      let colorScaleMax = 0;

      for (let x = 0; x <= width / circleRadius; x += 1) {
        const cx = circleRadius * (2 * x + 1);
        grid[x] = [];
        for (let y = 0; y <= height / circleRadius; y += 1) {
          const cy = circleRadius * (2 * y + 1);
          const pixel = getPixel(canvasContext, {x: cx, y: cy});
          const red = pixel[0];
          const green = pixel[1];
          const blue = pixel[2];
          const circle = {cx, cy, x, y};
          if (red + green + blue > 300) {
            const colorScale = red - blue;
            colorScaleMin = Math.min(colorScale, colorScaleMin);
            colorScaleMax = Math.max(colorScale, colorScaleMax);
            circle.colorScale = colorScale;
            circles.push(circle);
          }
          grid[x].push(circle);
        }
      }

      each(circles, (circle) => {
        const relativeColorScale = (circle.colorScale - colorScaleMin) / (colorScaleMax - colorScaleMin);

        if (relativeColorScale < 0.53) {
          circle.fill = '#007AFF';
        } else if (relativeColorScale > 0.61) {
          circle.fill = '#F07';
        } else {
          circle.fill = '#D000D6';
        }
      });

      for (let x = 0; x < grid.length - 1; x += 1) {
        for (let y = 0; y < grid[x].length - 1; y += 1) {
          const circle = grid[x][y];
          const circleRight = grid[x + 1][y];
          const circleDown = grid[x][y + 1];
          if (circle.fill === circleRight.fill && Math.random() > 0.8) {
            circle.hasRightConnector = true;
          }
          if (circle.fill === circleDown.fill && Math.random() > 0.8) {
            circle.hasDownConnector = true;
          }
        }
      }

      setCircles(circles);
    },
    drawMosaic: ({canvasContext, circleRadius, setCircles, width: _width, height: _height}) => (params = {}) => {
      const circles = [];
      const width = _width || params.width;
      const height = _height || params.height;

      for (let x = circleRadius; x <= width - circleRadius; x += circleRadius * 2) {
        for (let y = circleRadius; y <= height - circleRadius; y += circleRadius * 2) {
          const pixel = getPixel(canvasContext, {x, y});
          const fill = `rgba(${pixel.join()})`;
          circles.push({cx: x, cy: y, fill});
        }
      }

      setCircles(circles);
    },
  }),
  withPropsOnChange(['circleRadius'], ({drawShapes}) => {
    drawShapes();
  }),
  withHandlers({
    handleCanvasClick: ({canvasContext, canvasRef}) => (event) => {
      console.log(getPixel(canvasContext, getCursorPosition(canvasRef.current, event)));
    },
    handleImageLoad: ({canvasContext, canvasRef, drawShapes, imageRef, setSize}) => () => {
      const {width, height} = imageRef.current.getBoundingClientRect();

      canvasRef.current.width = width;
      canvasRef.current.height = height;
      canvasContext.drawImage(imageRef.current, 0, 0);

      setSize({width, height});
      drawShapes({width, height});
    },
  }),
  lifecycle({
    componentDidMount() {
      const {canvasRef, setCanvasContext} = this.props;

      const context = canvasRef.current.getContext('2d');

      setCanvasContext(context);
    },
  }),
)(({canvasRef, circleRadius, circles, handleCanvasClick, handleImageLoad, height, imageRef, imageSrc, width}) => (
  <div className="metaball-picture is-debug" style={{width, height}}>
    <img ref={imageRef} src={imageSrc} alt="source" onLoad={handleImageLoad}/>
    <canvas ref={canvasRef} onClick={handleCanvasClick}/>
    <svg width={width} height={height}>
      {map(circles, ({cx, cy, fill, hasDownConnector, hasRightConnector}, i) => (
        <React.Fragment key={i}>
          <circle cx={cx} cy={cy} fill={fill} r={circleRadius / 1.44}/>

          {hasDownConnector && (
            <path
              d="M0,0c27.61,27.61 72.39,27.61 100,0c-27.61,27.61 -27.61,72.39 0,100c-27.61,-27.61 -72.39,-27.61 -100,0c27.61,-27.61 27.61,-72.39 0,-100z"
              fill={fill}
              style={{
                transform: `translate(${cx - circleRadius / 2}px, ${cy + circleRadius / 2}px) scale(${circleRadius / 100})`,
              }}
            />
          )}

          {hasRightConnector && (
            <path
              d="M0,0c27.61,27.61 72.39,27.61 100,0c-27.61,27.61 -27.61,72.39 0,100c-27.61,-27.61 -72.39,-27.61 -100,0c27.61,-27.61 27.61,-72.39 0,-100z"
              fill={fill}
              style={{
                transform: `translate(${cx + circleRadius / 2}px, ${cy - circleRadius / 2}px) scale(${circleRadius / 100})`,
              }}
            />
          )}
        </React.Fragment>
      ))}
    </svg>
  </div>
));

export default MetaballPicture;
