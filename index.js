'use strict';

const Logger = require('./logger');
const Appender = require('./appender');
const prod = require('isprod');

module.exports = Object.assign(prod ? Logger.Prod : Logger.Console, {Logger, Appender});
