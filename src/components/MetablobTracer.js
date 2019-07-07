import React from 'react';
import {
  defaultProps,
  compose,
  withPropsOnChange,
  withState, withStateHandlers, withHandlers,
} from 'recompose';
import cn from 'classnames';
import potrace from 'potrace';

import getSVGImageSourceFromString from '../utilities/getSVGImageSourceFromString';

const enhance = compose(
  defaultProps({
    canvasRef: React.createRef(),
    imageRef: React.createRef(),
  }),
  withState('canvasContext', 'setCanvasContext'),
  withState('SVGImageSource', 'setSVGImageSource'),
  withStateHandlers({}, {
    setState: () => (newState) => (newState),
  }),
  withHandlers({
    drawShapes: (props) => (nextState) => {
      // merge nextState with props, to get the most up-to-date info
      const {
        imageSrc,
        height,
        setSVGImageSource,
        width,
      } = {...props, ...nextState};

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
);

const MetablobTracer = (props) => {
  const {
    handleFacetChange,
    imageRef,
    imageSrc,
    isSourceLayerVisible,
    isOutputLayerVisible,
    SVGImageSource,
  } = props;

  return (
    <div className="metaball-picture bg-gray">
      <img ref={imageRef} src={imageSrc} alt="source" onLoad={handleFacetChange} className="metaball-picture-loader"/>

      <div className="metaball-picture-layers">
        <img src={imageSrc} alt="source" className={cn({hidden: !isSourceLayerVisible})}/>
        <img src={SVGImageSource} alt="output" className={cn({hidden: !isOutputLayerVisible})}/>
      </div>
    </div>
  );
};

export default enhance(MetablobTracer);
