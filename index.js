'use strict';

const Logger = require('./lib/logger');
const Appender = require('./lib/appender');
const prod = require('isprod');

module.exports = Object.assign(prod ? Logger.Prod : Logger.Standard, {Logger, Appender});
