import React from 'react';
import { compose, defaultProps, withHandlers } from 'recompose';

const Uploader = compose(
  defaultProps({
    onFileChange: (fileUrl) => {
      console.warn('Warning: missing "onFileChange" prop on ImageUploadTest component.')
    },
  }),
  withHandlers({
    handleFileInputChange: ({ onFileChange }) => (event) => {
      const files = event.target.files;
      const fileURL = window.URL.createObjectURL(files[0]);
      onFileChange && onFileChange(fileURL);
    },
  }),
)((props) => (
  <input type="file" accept="image/*" onChange={props.handleFileInputChange} />
));

export default Uploader;
