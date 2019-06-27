import {renderToString} from 'react-dom/server';

const getSVGImageSourceFromComponent = (component) => {
  let metaballsSVGString = renderToString(component);
  // console.log(metaballsSVGString);
  metaballsSVGString = encodeURIComponent(metaballsSVGString);
  return `data:image/svg+xml;charset=utf-8,${metaballsSVGString}`;
};

export default getSVGImageSourceFromComponent;
