import React from 'react';
import {compose, withState, withHandlers} from 'recompose';

// import abeImage from './abe.jpg';
import jimmyImage from './jimmy.jpg';

import ImageUploadTest from './ImageUploadTest';
import MetaballPicture from './MetaballPicture';

const enhance = compose(
  withState('imageSrc', 'setImageSrc', jimmyImage),
  withState('dotCount', 'setDotCount', 100),
  withHandlers({
    handleDotCountChange: ({setDotCount}) => (event) => {
      setDotCount(parseInt(event.target.value));
    },
  }),
);

const ImageEffects = ({dotCount, handleDotCountChange, imageSrc, setImageSrc}) => (
  <div className="image-effects">
    <input
      type="range"
      min={10}
      max={160}
      step={10}
      value={dotCount}
      onChange={handleDotCountChange}
    />
    <ImageUploadTest onFileChange={setImageSrc}/>
    <MetaballPicture imageSrc={imageSrc} dotCount={dotCount}/>
  </div>
);

export default enhance(ImageEffects);
