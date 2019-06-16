import {renderToString} from 'react-dom/server';

const getSVGImageSourceFromComponent = (component) => {
  let metaballsSVGString = renderToString(component);
  metaballsSVGString = metaballsSVGString.replace(/><\/[A-z]+>/g, '/>');
  metaballsSVGString = metaballsSVGString.replace(/data-reactroot=""/g, '');
  // console.log(metaballsSVGString);
  metaballsSVGString = encodeURIComponent(metaballsSVGString);
  return `data:image/svg+xml;charset=utf-8,${metaballsSVGString}`;
};

export default getSVGImageSourceFromComponent;
