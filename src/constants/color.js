import {each} from 'lodash';

const COLOR = {
  BLUE: {
    hex: '#007AFF',
    opacity: 1,
  },
  PURPLE: {
    hex: '#D000D6',
    opacity: 1,
  },
  RED: {
    hex: '#F07',
    opacity: 1,
  },
  WHITE: {
    hex: '#fff',
    opacity: 1,
  },
  LIGHT_GRAY: {
    hex: '#fff',
    opacity: 0.5,
  },
  GRAY: {
    hex: '#fff',
    opacity: 0.25,
  },
};

each(COLOR, (o, key) => o.key = key);

export default COLOR;
