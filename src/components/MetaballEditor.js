import React from 'react';
import {compose, withState, withHandlers, withPropsOnChange} from 'recompose';

// import abeImage from './abe.jpg';
import jimmyImage from '../assets/jimmy.jpg';

import ImageDropZone from './ImageDropZone';
import MetaballTracer from './MetaballTracer';

const enhance = compose(
  withState('imageSrc', 'setImageSrc', jimmyImage),
  withState('dotCount', 'setDotCount', 100),
  withState('brightnessThreshold', 'setBrightnessThreshold', 91),
  withState('lowThreshold', 'setBlueThreshold', 0.53),
  withState('highThreshold', 'setRedThreshold', 0.61),
  withState('isSourceLayerVisible', 'setIsSourceLayerVisible', false),
  withState('isScaledLayerVisible', 'setIsScaledLayerVisible', false),
  withState('isOutputLayerVisible', 'setIsOutputLayerVisible', true),
  withState('mode', 'setMode', 'color'),
  withPropsOnChange(['mode'], ({ mode }) => {
    if (mode === 'color') {
      return {
        highThresholdLabel: 'Red',
        lowThresholdLabel: 'Blue',
      };
    }
    if (mode === 'monochrome') {
      return {
        highThresholdLabel: 'White',
        lowThresholdLabel: 'Dark Gray',
      };
    }
  }),
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
    handleModeChange: ({setMode}) => (event) => {
      setMode(event.target.value);
    },
  }),
);

const MetaballEditor = (props) => {
  const {
    brightnessThreshold,
    dotCount,
    lowThreshold,
    lowThresholdLabel,
    highThreshold,
    highThresholdLabel,
    handleDotCountChange,
    handleBrightnessThresholdChange,
    handleBlueThresholdChange,
    handleRedThresholdChange,
    handleIsSourceLayerVisible,
    handleIsScaledLayerVisible,
    handleIsOutputLayerVisible,
    handleModeChange,
    isSourceLayerVisible,
    isScaledLayerVisible,
    isOutputLayerVisible,
    imageSrc,
    mode,
    setImageSrc,
  } = props;

  return (
    <div className="image-effects">
      <MetaballTracer
        imageSrc={imageSrc}
        brightnessThreshold={brightnessThreshold}
        dotCount={dotCount}
        lowThreshold={lowThreshold}
        highThreshold={highThreshold}
        isSourceLayerVisible={isSourceLayerVisible}
        isScaledLayerVisible={isScaledLayerVisible}
        isOutputLayerVisible={isOutputLayerVisible}
        mode={mode}
      />
      <div className="image-effects-menu">
        <div className="form-group">
          <ImageDropZone onFileChange={setImageSrc}/>
        </div>
        <div className="form-group">
          <label>Mode</label>
          <label>
            <input
              type="radio"
              name="mode"
              value="color"
              checked={mode === 'color'}
              onChange={handleModeChange}
            />
            Color
          </label>
          <label>
            <input
              type="radio"
              name="mode"
              value="monochrome"
              checked={mode === 'monochrome'}
              onChange={handleModeChange}
            />
            Monochrome
          </label>
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
          <label>{lowThresholdLabel} ({lowThreshold})</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={lowThreshold}
            onChange={handleBlueThresholdChange}
          />
        </div>
        <div className="form-group">
          <label>{highThresholdLabel} ({highThreshold})</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={highThreshold}
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
