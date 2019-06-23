import React from 'react';
import Dropzone from 'react-dropzone'
import {compose, defaultProps, withHandlers} from 'recompose';

const ImageDropZone = compose(
  defaultProps({
    onFileChange: (fileUrl) => {
      console.warn('Warning: missing "onFileChange" prop on ImageUploadTest component.')
    },
  }),
  withHandlers({
    handleFileInputChange: ({onFileChange}) => (files) => {
      if (files && files.length > 0) {
        const fileURL = window.URL.createObjectURL(files[0]);
        onFileChange && onFileChange(fileURL);
      }
    },
  }),
)((props) => (
  <Dropzone onDrop={props.handleFileInputChange}>
    {({getRootProps, getInputProps}) => (
      <div {...getRootProps()} className="drop-zone">
        <input {...getInputProps()} />
        <p>Drag an image here, or click to browse for one.</p>
      </div>
    )}
  </Dropzone>
));

export default ImageDropZone;
