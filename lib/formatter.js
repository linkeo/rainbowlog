'use strict';

const clicolor = require('cli-color');
const moment = require('moment');
const ident = require('./identifier');

const tagStyles = [
  'background',
  'bracket',
  'hidden',
  'plain',
];

const defaultOptions = {
  line: '${time} ${tag} ${output}',
  timeFormat: 'YYYY-MM-DD HH:mm:ss.SSS',
  tagStyle: 'background',
  tagLength: 5,
};

class Formatter {
  constructor(options) {
    // assign options to formatter
    const opt = Object.seal(Object.assign({}, defaultOptions));
    Object.assign(opt, options);
    Object.assign(this, opt);

    // check options
    if (!this.line.includes('${output}')) {
      throw new Error('"${output}" is necessary in output line. "${time}" and "${tag}" is also recommended to be included in output line.');
    }
    if (typeof this.timeFormat !== 'string' || this.timeFormat.length === 0) {
      throw new Error('timeFormat option should be an non-empty string, for details, see moment.js Format');
    }
    let found = false;
    for (const available of tagStyles) {
      if (!found && available.toLowerCase() === this.tagStyle.toLowerCase()) {
        this.tagStyle = available;
        found = true;
      }
    }
    if (!found) {
      throw new Error(`Unknown tag style "${this.tagStyle}", please use one of "${tagStyles}".`);
    }
  }
  format(tag, text) {
    const color = this.levels[tag];
    const fg = clicolor[color];
    const bg = clicolor[bgStyle(color)];
    const time = moment().format(this.timeFormat);
    const tagt = tagText(ident.pascalcase(tag), this.tagStyle, this.tagLength);
    const tagr = this.tagStyle === 'background' ? bg(tagt) : fg(tagt);
    const output = fg(text);
    return this.line
               .replace('${time}', time)
               .replace('${tag}', tagr)
               .replace('${output}', output);
  }
}

function tagText(tag, style, len) {
  const fixed = len > 0 ? fix(tag, len) : tag;
  const shortened = tag.length > fixed.length;
  switch (style) {
    case 'plain':
      return ` ${fixed} `;
    case 'background':
      return shortened ? ` ${fixed}.` : ` ${fixed} `;
    case 'bracket':
      return `[${fixed}]`;
    case 'hidden':
      return '';
    default:
      throw new Error(`Unknown tag style ${style}`);
  }
}

function fix(str, len) {
  let s = str.slice(0, len);
  let padAfter = true;
  while (s.length < len) {
    s = padAfter ? `${s} ` : ` ${s}`;
    padAfter = !padAfter;
  }
  return s;
}

function bgStyle(color) {
  return `bg${color[0].toUpperCase()}${color.slice(1)}`;
}

module.exports = Formatter;
