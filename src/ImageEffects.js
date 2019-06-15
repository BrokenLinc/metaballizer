import React from 'react';
import {compose, withState, withHandlers} from 'recompose';

// import abeImage from './abe.jpg';
import jimmyImage from './jimmy.jpg';

import MetaballPicture from './MetaballPicture';

const ImageEffects = compose(
  withState('circleRadius', 'setCircleRadius', 2),
  withHandlers({
    handleCircleRadiusChange: ({setCircleRadius}) => (event) => {
      setCircleRadius(parseInt(event.target.value));
    },
  }),
)(({circleRadius, handleCircleRadiusChange}) => (
  <div className="image-effects">
    <MetaballPicture imageSrc={jimmyImage} circleRadius={circleRadius}/>
    {/*<input*/}
    {/*  type="range"*/}
    {/*  min={2}*/}
    {/*  max={50}*/}
    {/*  value={circleRadius}*/}
    {/*  onChange={handleCircleRadiusChange}*/}
    {/*/>*/}
  </div>
));

export default ImageEffects;
