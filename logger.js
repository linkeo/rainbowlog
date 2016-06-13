'use strict';

const util = require('util');

const Appender = require('./appender');
const Formatter = require('./formatter');
const ident = require('./lib/identifier');
// const colorfy = require('./colorfy');

const colors = [
  'black', 'blackBright',
  'red', 'redBright',
  'green', 'greenBright',
  'yellow', 'yellowBright',
  'blue', 'blueBright',
  'magenta', 'magentaBright',
  'cyan', 'cyanBright',
  'white', 'whiteBright',
];

const defaultLevels = {
  trace: 'green',
  debug: 'cyan',
  info: 'blue',
  warn: 'yellow',
  error: 'red',
  fatal: 'magenta',
};

const colorLevels = [];
colors.forEach(color => colorLevels[color] = color);

const defaultConfig = {
  appenders: [
    Appender.Console,
  ],
};

class Logger {
  constructor(config) {
    if (config == null) {
      config = defaultConfig;
    }
    Object.defineProperty(this, 'formatter', {value: new Formatter(config.format)});
    Object.defineProperty(this, 'appenders', {
      value: (config.appenders || [Appender.Console]).map(appenderConfig =>
        appenderConfig instanceof Appender
          ? appenderConfig
          : new Appender(appenderConfig)
        ),
    });
    const levels = config.levels || defaultLevels;
    for (const level in levels) {
      if (levels.hasOwnProperty(level)) {
        const color = levels[level];
        let found = false;
        for (const available of colors) {
          if (!found && available.toLowerCase() === color.toLowerCase()) {
            levels[level] = available;
            found = true;
          }
        }
        if (!found) {
          throw new Error(`Unknown color value "${color}", please use basic colors in cli-color.`);
        }
      }
    }
    Object.defineProperty(this, 'levels', {value: levels});
    Object.defineProperty(this.formatter, 'levels', {value: levels});
    for (const level of Object.keys(levels || {})) {
      const func = (...args) => {
        this.log(level, ...args);
      };
      func.color = levels[level];
      this[ident.functionName(level)] = func;
    }
  }

  log(level, ...args) {
    let found = false;
    for (const available of Object.keys(this.levels)) {
      if (!found && available.toLowerCase() === level.toLowerCase()) {
        level = available;
        found = true;
      }
    }
    if (!found) {
      throw new Error(`Use undefined level "${level}" to print output, please use one of "${Object.keys(this.levels)}"`);
    }
    const output = util.format(...args);
    if (found) {
      const formattedOutput = this.formatter.format(level, output);
      this.appenders.forEach(appender => appender.append(level, formattedOutput));
    } else {
      this.appenders.forEach(appender => appender.append(level, output));
    }
  }
}

Logger.Console = new Logger(defaultConfig);
Logger.Colors = new Logger(Object.assign({}, defaultConfig, {levels: colorLevels}));
Logger.Prod = new Logger({appenders: [Appender.Console, Appender.Prod]});

module.exports = Logger;
