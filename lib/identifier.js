'use strict';

const styles = {
  camelcase: /^[a-z][a-z0-9]*([A-Z][a-z0-9]*)*$/,
  pascalcase: /^[A-Z][a-z0-9]*([A-Z][a-z0-9]*)*$/,
  underscore: /^_*(?:[A-Z][A-Z0-9]*|[a-z])[a-z0-9]*(_[A-Z0-9]*[a-z0-9]*)*$/,
  upperunderscore: /^[A-Z][A-Z0-9]*(_[A-Z0-9]*)*$/,
};

function detectStyle(str) {
  const posibilities = [];
  for (const style in styles) {
    if (styles.hasOwnProperty(style)) {
      if (styles[style].test(str)) {
        posibilities.push(style);
      }
    }
  }
  if (posibilities.length === 0) {
    return null;
  } else if (posibilities.length === 1) {
    return posibilities[0];
  }
  return posibilities;
}

function split(str) {
  switch (detectStyle(str)) {
    case 'camelcase':
    case 'pascalcase':
      return str.split(/(?=[A-Z])/g);
    case 'underscore':
    case 'upperunderscore':
      return str.split('_');
    default:
      return str.split(/[^A-Za-z0-9]+/g);
  }
}
// /(?=[A-Z](?:[a-z0-9_]|$))|\W+/g
exports.camelcase = function camelcase(str) {
  return split(str).map((w, i) => i !== 0 && w.length > 0 ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w.toLowerCase()).join('');
};

exports.pascalcase = function pascalcase(str) {
  return split(str).map(w => w.length > 0 ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w.toLowerCase()).join('');
};
exports.underscore = function underscore(str) {
  return split(str).map(w => w.toLowerCase()).join('_');
};
exports.upperunderscore = function upperunderscore(str) {
  return split(str).map(w => w.toUpperCase()).join('_');
};

exports.functionName = exports.camelcase;
exports.variableName = exports.camelcase;
exports.className = exports.pascalcase;
exports.constantName = exports.upperunderscore;
