'use strict';

/* eslint no-console: 0, new-cap: 0, prefer-rest-params: 0 */

const colorout = exports.colorout = require('./colorout.js');
const util = require('util');
const moment = require('moment');
const timeFormat = 'YYYY-MM-DD HH:mm:ss.SSS';

exports.prod = false; // Under prod mode, doesn't print 'log.trace' and 'log.debug'

const Colors = exports.Colors = {
  Default: -1,
  Black: 0,
  Red: 1,
  Green: 2,
  Yellow: 3,
  Blue: 4,
  Magenta: 5,
  Cyan: 6,
  White: 7,
};

function textColor(clr) {
  switch (clr) {
    case Colors.Black:
      return colorout.Colors.black;
    case Colors.Red:
      return colorout.Colors.red;
    case Colors.Green:
      return colorout.Colors.green;
    case Colors.Yellow:
      return colorout.Colors.yellow;
    case Colors.Blue:
      return colorout.Colors.blue;
    case Colors.Magenta:
      return colorout.Colors.magenta;
    case Colors.Cyan:
      return colorout.Colors.cyan;
    case Colors.White:
      return colorout.Colors.white;
    default:
      return -1;
  }
}

function backgroundColor(clr) {
  switch (clr) {
    case Colors.Black:
      return colorout.Backgrounds.black;
    case Colors.Red:
      return colorout.Backgrounds.red;
    case Colors.Green:
      return colorout.Backgrounds.green;
    case Colors.Yellow:
      return colorout.Backgrounds.yellow;
    case Colors.Blue:
      return colorout.Backgrounds.blue;
    case Colors.Magenta:
      return colorout.Backgrounds.magenta;
    case Colors.Cyan:
      return colorout.Backgrounds.cyan;
    case Colors.White:
      return colorout.Backgrounds.white;
    default:
      return -1;
  }
}

function current() {
  return moment().format(timeFormat);
}

// function echoc(clr, txt) {
//   const timestamp = current();
//   let output = timestamp + colorout.TextColor(clr, txt);
//   if (clr === -1) {
//     output = timestamp + txt;
//   }
//   console.log(output);
// }

function echo(clr, tag, isError, txt) {
  const timestamp = current();
  const prefix = tag ? `[${tag}] ` : '';
  let output = `${timestamp} ${colorout.TextColor(clr, prefix + txt)}`;
  if (clr === -1) {
    output = `${timestamp} ${prefix}${txt}`;
  }
  if (!isError) {
    console.log(output);
  } else {
    console.error(output);
  }
}


function echoWithBgTag(clr, bg, tag, isError, txt) {
  const timestamp = current();
  const prefix = tag ? `${colorout.TextColorWithBackground(colorout.Colors.white, bg, ` ${tag} `)} ` : '';
  let output = `${timestamp} ${prefix}${colorout.TextColor(clr, txt)}`;
  if (clr === -1) {
    output = `${timestamp} ${prefix}${txt}`;
  }
  if (!isError) {
    console.log(output);
  } else {
    console.error(output);
  }
}

const Levels = exports.Levels = {
  Trace: 0,
  Debug: 1,
  Standard: 2,
  Info: 3,
  Warn: 4,
  Error: 5,
  Fatal: 6,
};

function Logger(tag, lvl, clr, bg) {
  this.tag = tag;
  this.lvl = lvl;
  this.clr = clr;
  this.bg = bg;
  this.log = this.log.bind(this);
  return this;
}

Logger.prototype.log = function() {
  if (!exports.prod || (this.lvl > Levels.Debug)) {
    if (this.bg != null) {
      echoWithBgTag(
        textColor(this.clr),
        backgroundColor(this.bg),
        this.tag,
        this.lvl > Levels.Warn,
        util.format.apply(this, arguments)
      );
    } else {
      echo(
        textColor(this.clr),
        this.tag,
        this.lvl > Levels.Warn,
        util.format.apply(this, arguments)
      );
    }
  }
};

exports.Logger = Logger;

exports.Black = new Logger(null, Levels.Standard, Colors.Black);
exports.Red = new Logger(null, Levels.Standard, Colors.Red);
exports.Green = new Logger(null, Levels.Standard, Colors.Green);
exports.Yellow = new Logger(null, Levels.Standard, Colors.Yellow);
exports.Blue = new Logger(null, Levels.Standard, Colors.Blue);
exports.Magenta = new Logger(null, Levels.Standard, Colors.Magenta);
exports.Cyan = new Logger(null, Levels.Standard, Colors.Cyan);
exports.White = new Logger(null, Levels.Standard, Colors.White);

exports.Standard = new Logger(null, Levels.Standard, Colors.Default);
exports.Fatal = new Logger('Fatal', Levels.Fatal, Colors.Magenta, Colors.Magenta);
exports.Error = new Logger('Error', Levels.Error, Colors.Red, Colors.Red);
exports.Warn = new Logger('Warn', Levels.Warn, Colors.Yellow, Colors.Yellow);
exports.Info = new Logger('Info', Levels.Info, Colors.Blue, Colors.Blue);
exports.Debug = new Logger('Debug', Levels.Debug, Colors.Cyan, Colors.Cyan);
exports.Trace = new Logger('Trace', Levels.Trace, Colors.Green, Colors.Green);

exports.black = exports.Black.log;
exports.red = exports.Red.log;
exports.green = exports.Green.log;
exports.yellow = exports.Yellow.log;
exports.blue = exports.Blue.log;
exports.magenta = exports.Magenta.log;
exports.cyan = exports.Cyan.log;
exports.white = exports.White.log;
exports.standard = exports.Standard.log;
exports.fatal = exports.Fatal.log;
exports.error = exports.Error.log;
exports.warn = exports.Warn.log;
exports.info = exports.Info.log;
exports.debug = exports.Debug.log;
exports.trace = exports.Trace.log;
