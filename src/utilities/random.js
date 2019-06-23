import {isNil, isNumber} from 'lodash';

let seed = 1;

export const seedRandom = (newSeed = 1) => {
  if (isNumber(newSeed)) {
    console.log('ressed');
    seed = newSeed;
  }
};

const random = (specialSeed) => {
  const thisSeed = isNil(specialSeed) ? seed++ : specialSeed;
  const x = Math.sin(thisSeed) * 10000;
  return x - Math.floor(x);
};

export default random;
