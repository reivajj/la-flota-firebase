import { useState, useCallback } from 'react';
import Danger from 'components/Typography/Danger';

export const to = promise => {
  return promise.then(data => {
    return [null, data];
  })
    .catch(err => [err]);
}

export const toWithOutError = (promise) => {
  return promise.then(result => result);
}

export const errorFormat = (message) => (
  <Danger color="error" variant="h6">{message}</Danger>
);

export const getChildData = (obj, key) => obj[key];

// Limited to only JSON supported types.
export const cloneDeepLimited = obj => JSON.parse(JSON.stringify(obj));

export const copyFormDataToJSON = formData => {
  var object = {};
  formData.forEach((value, key) => {
    if (key === "cover" || key === "track") {
      console.log("VALUE FILE: ", value);
      object[key] = { originalname: value.originalname, sizeInMB: value.size / 1000000 }
    }
    else object[key] = value
  });
  var json = JSON.parse(JSON.stringify(object));
  return json;
}

export const useForceUpdate = () => {
  const [, setTick] = useState(0);
  const update = useCallback(() => {
    setTick(tick => tick + 1);
  }, [])
  return update;
}

export const combineArraysWithNoDuplicates = (arr1, arr2) => [...new Set(arr1.concat(arr2))];

export const deepEqual = function (x, y) {
  if (x === y) return true;
  else if ((typeof x == "object" && x != null) && (typeof y == "object" && y != null)) {
    if (Object.keys(x).length !== Object.keys(y).length) return false;

    for (var prop in x) {
      if (y.hasOwnProperty(prop)) if (!deepEqual(x[prop], y[prop])) return false;
      else return false;
    }
    return true;
  }
  else return false;
}

export const truncateFloat = (number, decimals, separator) => {
  if (number === 0) return number;
  let decimalsTruncated = number.toString().split(separator)[1].slice(0, decimals);
  return parseFloat(`${number.toString().split(separator)[0]}${separator}${decimalsTruncated}`);
}