'use strict';

const util = require('util');

const Appender = require('./appender');
const Formatter = require('./formatter');
// const colorfy = require('./colorfy');

const defaultConfig = {
  format: {
    log: '${time} ${tag} ${output}',
    time: 'YYYY-MM-DD HH:mm:ss.SSS',
    tag: 'background',
  },
  levels: {
    trace: 'green',
    debug: 'cyan',
    info: 'blue',
    warn: 'yellow',
    error: 'red',
    fatal: 'magenta',
  },
  appenders: [
    Appender.Console,
  ],
};

class Logger {
  constructor(config) {
    if (config == null) {
      config = defaultConfig;
    }
    this.formatter = new Formatter(config.format);
    this.appenders = (config.appenders || []).map(appenderConfig =>
      appenderConfig instanceof Appender
        ? appenderConfig
        : new Appender(appenderConfig)
    );
    this.formatter.levels = config.levels;
    for (const level of Object.keys(config.levels || {})) {
      this[level] = (...args) => {
        this.log(level, ...args);
      };
    }
  }

  log(level, ...args) {
    const output = util.format(...args);
    const formattedOutput = this.formatter.format(level, output);
    this.appenders.forEach(appender => appender.append(level, formattedOutput));
  }

}

module.exports = Logger;
