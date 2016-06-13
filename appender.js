'use strict';

const os = require('os');
const fs = require('fs-extra');
const path = require('path');
const moment = require('moment');

const tzOffset = (new Date()).getTimezoneOffset() * 60000;

const chunkTimeFormat = 'YYYY-MM-DD-HH';
const chunkTimeOptionPattern = /^(\d+) ?(d|day|days|h|hour|hours)$/;
const chunkSizeOptionPattern = /^([\d\.]+) ?(b|byte|bytes|k|kb|m|mb|g|gb)?$/;

const defaultOptions = {
  type: 'console',
  levels: 'all',
  chunkTime: null,
  chunkSize: 64 * 1024 * 1024,
  filename: 'output',
  filepath: path.join(process.cwd(), 'logs'),
};

class Appender {
  constructor(options) {
    const config = Object.assign({}, defaultOptions);
    Object.seal(config);
    Object.assign(config, options);
    Object.defineProperties(this, {
      levels: {writable: true},
      type: {writable: true, enumerable: true},
      chunkRule: {writable: true},
      outputStream: {writable: true},
    });
    this.levels = config.levels || 'all';
    switch (config.type) {
      case 'console':
        this.type = 'console';
        this.outputStream = process.stdout;
        break;
      case 'file':
        this.type = 'file';
        this.chunkRule = {
          time: parseChunkTimeOption(config.chunkTime),
          size: parseChunkSizeOption(config.chunkSize),
          name: config.filename,
          path: config.filepath,
          bufSize: 0,
        };
        this.chunkRule.curr = currentTimeSection(this.chunkRule);
        break;
      default:
        throw new Error(`unknown appender type "${config.type}"`);
    }
  }
  append(level, output) {
    const amount = Buffer.byteLength(output);
    if (this.outputStream == null) {
      this.outputStream = fs.createWriteStream(getChunkFilename(this.chunkRule), {flags: 'a'});
    }
    if (this.levels === 'all' || this.levels.includes(level)) {
      switch (this.type) {
        case 'console':
          this.outputStream.cork();
          this.outputStream.write(output);
          this.outputStream.write(os.EOL);
          this.outputStream.uncork();
          break;
        case 'file':
          if (this.chunkRule.size > 0) { // if should split by size limit.
            const curr = currentTimeSection(this.chunkRule);
            const n = (this.chunkRule.bufSize + amount > this.chunkRule.size)
                      ? this.chunkRule.n + 1
                      : this.chunkRule.n;
            if (curr !== this.chunkRule.curr || n !== this.chunkRule.n) { // switch to new file.
              this.chunkRule.curr = curr;
              this.chunkRule.n = n;
              this.chunkRule.bufSize = 0;
              this.outputStream.end();
              this.outputStream = fs.createWriteStream(getChunkFilename(this.chunkRule), {flags: 'a'});
            }
          }
          this.outputStream.cork();
          this.outputStream.write(output);
          this.outputStream.write(os.EOL);
          this.outputStream.uncork();
          this.chunkRule.bufSize += amount;
          break;
        default:
          // TODO print error
          break;
      }
    }
  }
}

function parseChunkSizeOption(option) {
  if (typeof option === 'number') {
    option = Math.round(option);
    if (option > 0) {
      return option;
    }
    return null;
  }
  if (!option) {
    return null;
  }
  if (typeof option !== 'string') {
    throw new Error('Cannot parse chunk size option whose type is other than string and number.');
  }
  const matched = (option || '').toLowerCase().match(chunkSizeOptionPattern);
  if (matched == null) {
    throw new Error(`Invalid chunk size option (${option || ''}), expect in pattern ${chunkSizeOptionPattern.source}`);
  }
  const value = Number(matched[1]);
  if (Number.isNaN(value) || value <= 0) {
    throw new Error(`Invalid number ${matched[1]}, expect a valid positive number.`);
  }
  const unit = matched[2];
  switch (unit) {
    case 'k':
    case 'kb':
      return value * 1024;
    case 'm':
    case 'mb':
      return value * 1024 * 1024;
    case 'g':
    case 'gb':
      return value * 1024 * 1024 * 1024;
    case 'b':
    case 'byte':
    case 'bytes':
    case '':
    case null:
    case undefined:
      return value;
    default:
      throw new Error(`Unsupported size unit "${unit}"`);
  }
}

function parseChunkTimeOption(option) {
  if (typeof option === 'number') {
    option = Math.round(option);
    if (option > 0) {
      return option;
    }
    return null;
  }
  if (!option) {
    return null;
  }
  if (typeof option !== 'string') {
    throw new Error('Cannot parse chunk time option whose type is other than string and number.');
  }
  const matched = (option || '').toLowerCase().match(chunkTimeOptionPattern);
  if (matched == null) {
    throw new Error(`Invalid chunk time option (${option || ''}), expect in pattern ${chunkTimeOptionPattern.source}`);
  }
  const value = Number(matched[1]);
  if (Number.isNaN(value) || value < 1) {
    throw new Error(`Invalid number ${matched[1]}, expect a valid positive integer.`);
  }
  const unit = matched[2];
  switch (unit) {
    case 'h':
    case 'hour':
    case 'hours':
      return value * 3600000;
    case 'd':
    case 'day':
    case 'days':
      return value * 24 * 3600000;
    default:
      throw new Error(`Unsupported time unit "${unit}"`);
  }
}


function currentTimeSection(rule) {
  const unit = rule.time;
  if (unit == null) {
    return '';
  }
  const curr = Date.now() - tzOffset;
  const currStart = Math.round(Math.floor(curr / unit) * unit) + tzOffset;
  return moment(currStart).format(chunkTimeFormat);
}

function getChunkFilename(rule) {
  fs.ensureDirSync(rule.path);
  if (rule.n == null) { // detect n from file list.
    const pattern = new RegExp(rule.curr ? `${rule.name}-${rule.curr}\\.(\\d+)\\.log` : `${rule.name}\\.(\\d+)\\.log`);
    const existings = fs.readdirSync(rule.path)
                  .map(fn => fn.match(pattern))
                  .filter(matched => matched != null);
    const max = existings.map(matched => Number(matched[1]))
                  .filter(num => !Number.isNaN(num))
                  .reduce((a, b) => Math.max(a, b), 0);
    rule.n = max;
  }
  const filename = path.join(rule.path, rule.curr ? `${rule.name}-${rule.curr}.${rule.n}.log` : `${rule.name}.${rule.n}.log`);
  fs.ensureFileSync(filename);
  const stats = fs.statSync(filename);
  rule.bufSize = stats.size;
  return filename;
}

Appender.Console = new Appender(defaultOptions);
Appender.DefaultFileAppender = new Appender({type: 'file'});
Appender.DailyFileAppender = new Appender({type: 'file', filename: 'daily', chunkTime: '1d', chunkSize: 0});
Appender.Prod = new Appender({type: 'file', levels: ['info', 'warn', 'error', 'fatal'], filename: 'prod', chunkTime: '1d'});

module.exports = Appender;
