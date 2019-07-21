import React from 'react';
import {compose, withState, withHandlers} from 'recompose';

import abeImage from '../assets/abe.jpg';
import jimmyImage from '../assets/jimmy.jpg';

import ImageDropZone from './ImageDropZone';
import MetablobTracer from './MetablobTracer';

const enhance = compose(
  withState('imageSrc', 'setImageSrc', abeImage),
  withState('isSourceLayerVisible', 'setIsSourceLayerVisible', false),
  withState('isAnalysisLayerVisible', 'setIsAnalysisLayerVisible', true),
  withState('isOutputLayerVisible', 'setIsOutputLayerVisible', true),
  withHandlers({
    handleIsSourceLayerVisible: ({setIsSourceLayerVisible}) => (event) => {
      setIsSourceLayerVisible(event.target.checked);
    },
    handleIsAnalysisLayerVisible: ({setIsAnalysisLayerVisible}) => (event) => {
      setIsAnalysisLayerVisible(event.target.checked);
    },
    handleIsOutputLayerVisible: ({setIsOutputLayerVisible}) => (event) => {
      setIsOutputLayerVisible(event.target.checked);
    },
  }),
);

const MetablobEditor = (props) => {
  const {
    handleIsSourceLayerVisible,
    handleIsAnalysisLayerVisible,
    handleIsOutputLayerVisible,
    isSourceLayerVisible,
    isAnalysisLayerVisible,
    isOutputLayerVisible,
    imageSrc,
    setImageSrc,
  } = props;

  return (
    <div className="image-effects">
      <MetablobTracer
        imageSrc={imageSrc}
        isSourceLayerVisible={isSourceLayerVisible}
        isAnalysisLayerVisible={isAnalysisLayerVisible}
        isOutputLayerVisible={isOutputLayerVisible}
      />
      <div className="image-effects-menu">
        <div className="form-group">
          <ImageDropZone onFileChange={setImageSrc}/>
        </div>
        <div className="form-group">
          <label>Layers</label>
          <label>
            <input
              type="checkbox"
              checked={isSourceLayerVisible}
              onChange={handleIsSourceLayerVisible}
            />
            Source Image
          </label>
          <label>
            <input
              type="checkbox"
              checked={isAnalysisLayerVisible}
              onChange={handleIsAnalysisLayerVisible}
            />
            Analysis Image
          </label>
          <label>
            <input
              type="checkbox"
              checked={isOutputLayerVisible}
              onChange={handleIsOutputLayerVisible}
            />
            Output Image
          </label>
        </div>
      </div>
    </div>
  );
};

export default enhance(MetablobEditor);
