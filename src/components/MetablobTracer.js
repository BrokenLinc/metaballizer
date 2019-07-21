import React from 'react';
import {
  defaultProps,
  compose,
  lifecycle,
  withPropsOnChange,
  withState,
  withStateHandlers,
  withHandlers,
} from 'recompose';
import cn from 'classnames';
import potrace from 'potrace';
import pointInSvgPolygon from 'point-in-svg-polygon';
import {each, get, map} from 'lodash';
import {withSafeInterval} from '@hocs/safe-timers';

import getSVGImageSourceFromString from '../utilities/getSVGImageSourceFromString';
import parseXML from '../utilities/parseXML';

const getAttributeValue = (node, attributeName) => {
  return get(node, `attributes.${attributeName}.nodeValue`);
};

const createSvgElement = (nodeType = 'svg', attributes) => {
  const element = document.createElementNS('http://www.w3.org/2000/svg', nodeType);
  map(attributes, (attributeValue, attributeName) => {
    element.setAttribute(attributeName, attributeValue);
  });
  return element;
};

const getDistanceToNearestCircle = (circle, circles, max = 10000000) => {
  let distance = max;
  each(circles, (testCircle) => {
    distance = Math.min(
      distance,
      Math.sqrt(
      Math.pow(circle.cx - testCircle.cx, 2)
      + Math.pow(circle.cy - testCircle.cy, 2)
      ) - testCircle.r,
    );
  });
  return distance;
};

const appendSVGElement = (parentElement, nodeType, attributes) => {
  const element = createSvgElement(nodeType, attributes);
  parentElement.appendChild(element);
  return element;
};

const enhance = compose(
  withSafeInterval,
  defaultProps({
    canvasRef: React.createRef(),
    imageRef: React.createRef(),
  }),
  withStateHandlers({circles: []}, {
    addCircle: ({circles}) => (circle) => ({circles: [...circles, circle]}),
    clearCircles: () => () => ({circles: []}),
  }),
  withState('canvasContext', 'setCanvasContext'),
  withState('pathObjects', 'setPathObjects'),
  withState('SVGImageSource', 'setSVGImageSource'),
  // withState('effectsSVGImageSource', 'setEffectsSVGImageSource'),
  withStateHandlers({}, {
    setState: () => (newState) => (newState),
  }),
  withHandlers({
    drawShapes: (props) => (nextState) => {
      // merge nextState with props, to get the most up-to-date info
      const {
        imageSrc,
        height,
        setPathObjects,
        setSVGImageSource,
        width,
      } = {...props, ...nextState};

      // TODO: take in potrace options as props
      potrace.posterize(
        imageSrc,
        {
          threshold: 80,
          steps: 0,
          // blackOnWhite: false,
          turdSize: width * height / 400,
        },
        (err, svgString) => {
          const svgImageSource = getSVGImageSourceFromString(svgString);
          setSVGImageSource(svgImageSource);

          const paths = parseXML(svgString).querySelectorAll('path');
          const pathObjects = map(paths, (path) => {
            const pathData = getAttributeValue(path, 'd');
            const fill = getAttributeValue(path, 'fill');
            const fillOpacity = getAttributeValue(path, 'fill-opacity');
            const subPathStrings = map(pathData.split('M'), (subPathString) => `M${subPathString.replace(/,/g, '')}`);
            return {
              fill,
              fillOpacity,
              subPathStrings,
            };
          });
          setPathObjects(pathObjects);
        });
    },
  }),
  withHandlers({
    handleFacetChange: (props) => () => {
      const {drawShapes, imageRef, setState} = props;

      // if there is an image, update the canvas dimensions
      if (imageRef.current) {
        const {width, height} = imageRef.current.getBoundingClientRect();

        // set nextState and pass to drawShapes since setState is async
        const nextState = {width, height};
        setState(nextState);
        drawShapes(nextState);
      }
    },
  }),
  withHandlers({
    growCircle: (props) => () => {
      const {
        addCircle,
        circles,
        pathObjects,
        width,
        height,
      } = props;

      each(pathObjects, ({subPathStrings}) => {
        each(subPathStrings, (subPathString) => {
          const randomPoint = [Math.random() * width, Math.random() * height];
          if (pointInSvgPolygon.isInside(randomPoint, subPathString)) {
            const circle = {
              cx: randomPoint[0],
              cy: randomPoint[1],
              r: 1,
            };

            const circleIsInside = (circle, subPathString) => {
              const { cx, cy, r } = circle;
              const r45 = 0.7071 * r;
              const points = [
                [cx, cy - r],
                [cx + r45, cy - r45],
                [cx + r, cy],
                [cx + r45, cy + r45],
                [cx, cy + r],
                [cx - r45, cy + r45],
                [cx - r, cy],
                [cx - r45, cy - r45],
              ];

              for(let i in points) {
                if (!pointInSvgPolygon.isInside(points[i], subPathString)) {
                  return false;
                }
              }

              return true;
            };

            const largestRadius = getDistanceToNearestCircle(circle, circles, width + height);

            if (largestRadius > 0) {
              let found = false;
              while(!found && circle.r < largestRadius) {
                const nextRadius = circle.r + 1;

                if (circleIsInside(circle, subPathString)) {
                  circle.r = nextRadius;
                } else {
                  found = true;
                }
              }

              addCircle(circle);
            }
          }
        });
      });
    },
  }),
  withPropsOnChange(['circles'], (props) => {
    const {circles, width, height} = props;
    const effectsSVG = createSvgElement('svg', {
      width,
      height,
    });

    each(circles, (circles) => {
      appendSVGElement(effectsSVG, 'circle', {
        ...circles,
        fill: 'yellow',
      });
    });

    const effectsSVGString = new XMLSerializer().serializeToString(effectsSVG);
    const effectsSVGImageSource = getSVGImageSourceFromString(effectsSVGString);

    return {
      effectsSVGImageSource,
    };
  }),
  lifecycle({
    componentDidMount() {
      const {growCircle, setSafeInterval} = this.props;
      setSafeInterval(growCircle, 200);
    },
  }),
);

const MetablobTracer = (props) => {
  const {
    handleFacetChange,
    imageRef,
    imageSrc,
    isAnalysisLayerVisible,
    isSourceLayerVisible,
    isOutputLayerVisible,
    SVGImageSource,
    effectsSVGImageSource,
  } = props;

  return (
    <div className="metaball-picture bg-gray">
      <img ref={imageRef} src={imageSrc} alt="source" onLoad={handleFacetChange} className="metaball-picture-loader"/>

      <div className="metaball-picture-layers">
        <img src={imageSrc} alt="source" className={cn({hidden: !isSourceLayerVisible})}/>
        <img src={SVGImageSource} alt="output" className={cn({hidden: !isAnalysisLayerVisible})}/>
        <img src={effectsSVGImageSource} alt="output" className={cn({hidden: !isOutputLayerVisible})}/>
      </div>
    </div>
  );
};

export default enhance(MetablobTracer);
