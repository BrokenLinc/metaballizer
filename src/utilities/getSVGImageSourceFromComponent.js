import {renderToString} from 'react-dom/server';

import getSVGImageSourceFromString from './getSVGImageSourceFromString';

const getSVGImageSourceFromComponent = (component) => {
  let metaballsSVGString = renderToString(component);
  return getSVGImageSourceFromString(metaballsSVGString);
};

export default getSVGImageSourceFromComponent;
