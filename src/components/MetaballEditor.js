import React from 'react';
import {compose, withState, withHandlers} from 'recompose';

// import abeImage from './abe.jpg';
import jimmyImage from '../assets/jimmy.jpg';

import ImageDropZone from './ImageDropZone';
import MetaballTracer from './MetaballTracer';

const enhance = compose(
  withState('imageSrc', 'setImageSrc', jimmyImage),
  withState('dotCount', 'setDotCount', 100),
  withState('brightnessThreshold', 'setBrightnessThreshold', 91),
  withState('blueThreshold', 'setBlueThreshold', 0.53),
  withState('redThreshold', 'setRedThreshold', 0.61),
  withState('isSourceLayerVisible', 'setIsSourceLayerVisible', false),
  withState('isScaledLayerVisible', 'setIsScaledLayerVisible', false),
  withState('isOutputLayerVisible', 'setIsOutputLayerVisible', true),
  withHandlers({
    handleBrightnessThresholdChange: ({setBrightnessThreshold}) => (event) => {
      setBrightnessThreshold(parseFloat(event.target.value));
    },
    handleDotCountChange: ({setDotCount}) => (event) => {
      setDotCount(parseFloat(event.target.value));
    },
    handleBlueThresholdChange: ({setBlueThreshold}) => (event) => {
      setBlueThreshold(parseFloat(event.target.value));
    },
    handleRedThresholdChange: ({setRedThreshold}) => (event) => {
      setRedThreshold(parseFloat(event.target.value));
    },
    handleIsSourceLayerVisible: ({setIsSourceLayerVisible}) => (event) => {
      setIsSourceLayerVisible(event.target.checked);
    },
    handleIsScaledLayerVisible: ({setIsScaledLayerVisible}) => (event) => {
      setIsScaledLayerVisible(event.target.checked);
    },
    handleIsOutputLayerVisible: ({setIsOutputLayerVisible}) => (event) => {
      setIsOutputLayerVisible(event.target.checked);
    },
  }),
);

const MetaballEditor = (props) => {
  const {
    brightnessThreshold,
    dotCount,
    blueThreshold,
    redThreshold,
    handleDotCountChange,
    handleBrightnessThresholdChange,
    handleBlueThresholdChange,
    handleRedThresholdChange,
    handleIsSourceLayerVisible,
    handleIsScaledLayerVisible,
    handleIsOutputLayerVisible,
    isSourceLayerVisible,
    isScaledLayerVisible,
    isOutputLayerVisible,
    imageSrc,
    setImageSrc,
  } = props;

  return (
    <div className="image-effects">
      <MetaballTracer
        imageSrc={imageSrc}
        brightnessThreshold={brightnessThreshold}
        dotCount={dotCount}
        blueThreshold={blueThreshold}
        redThreshold={redThreshold}
        isSourceLayerVisible={isSourceLayerVisible}
        isScaledLayerVisible={isScaledLayerVisible}
        isOutputLayerVisible={isOutputLayerVisible}
      />
      <div className="image-effects-menu">
        <div className="form-group">
          <ImageDropZone onFileChange={setImageSrc}/>
        </div>
        <div className="form-group">
          <label>Metaball Resolution ({dotCount})</label>
          <input
            type="range"
            min={10}
            max={160}
            step={10}
            value={dotCount}
            onChange={handleDotCountChange}
          />
        </div>
        <div className="form-group">
          <label>Metaball Quantity ({brightnessThreshold})</label>
          <input
            type="range"
            min={0}
            max={255}
            step={1}
            value={brightnessThreshold}
            onChange={handleBrightnessThresholdChange}
            className="rtl"
          />
        </div>
        <div className="form-group">
          <label>Blue ({blueThreshold})</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={blueThreshold}
            onChange={handleBlueThresholdChange}
          />
        </div>
        <div className="form-group">
          <label>Red ({redThreshold})</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={redThreshold}
            onChange={handleRedThresholdChange}
            className="rtl"
          />
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
              checked={isScaledLayerVisible}
              onChange={handleIsScaledLayerVisible}
            />
            Scaled Image (pixelated)
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

export default enhance(MetaballEditor);
