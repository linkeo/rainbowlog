var colorout = exports.colorout = require('./colorout.js');
var util = require('util');

exports.prod = false; // Under prod mode, doesn't print 'log.trace' and 'log.debug'

const Colors = exports.Colors = {
	Default		: -1,
	Black 		: 0,
	Red 		: 1,
	Green 		: 2,
	Yellow 		: 3,
	Blue 		: 4,
	Magenta 	: 5,
	Cyan 		: 6,
	White 		: 7
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

function timeFormat(time) {
	return time.toJSON().replace(/[TZ]/g, ' ');
}

function current() {
	return timeFormat(new Date());
}

function echoc (clr, txt) {
	const timestamp = current()
	var output = timestamp + colorout.TextColor(clr, txt)
	if (clr == -1) {
		output = timestamp + txt
	}
	console.log(output)
}

function echo (clr, tag, isError, txt) {
	const timestamp = current()
	const prefix = tag?'['+tag+'] ':'';
	var output = timestamp + colorout.TextColor(clr, prefix+txt)
	if (clr == -1) {
		output = timestamp + prefix+txt
	}
	if (isError) console.log(output);
	else console.error(output);
}


function echoWithBgTag (clr, bg, tag, isError, txt) {
	const timestamp = current()
	const prefix = tag?colorout.TextColorWithBackground(
		colorout.Colors.white, bg, 
		' '+tag+' ') + ' ':'';
	var output = timestamp + prefix + colorout.TextColor(clr,txt)
	if (clr == -1) {
		output = timestamp + prefix+txt
	}
	if (isError) console.log(output);
	else console.error(output);
}

const Levels = exports.Levels = {
	Trace 		: 0,
	Debug 		: 1,
	Standard 	: 2,
	Info 		: 3,
	Warn 		: 4,
	Error 		: 5,
	Fatal 		: 6
};

function Logger (tag, lvl, clr, bg) {
	this.tag = tag;
	this.lvl = lvl;
	this.clr = clr;
	this.bg = bg;
	return this;
}

Logger.prototype.log = function () {
	if (!exports.prod || (this.lvl > Levels.Debug)) {
		if (this.bg!=null)
			echoWithBgTag(
				textColor(this.clr),
				backgroundColor(this.bg),
				this.tag, 
				this.lvl > Levels.Info,
				util.format.apply(this, arguments));
		else 
			echo(
				textColor(this.clr), 
				this.tag, 
				this.lvl > Levels.Info,
				util.format.apply(this, arguments));
	}
}

exports.Logger = Logger;

const Black = exports.Black = 
	new Logger(null, Levels.Standard, Colors.Black);
const Red = exports.Red = 
	new Logger(null, Levels.Standard, Colors.Red);
const Green = exports.Green = 
	new Logger(null, Levels.Standard, Colors.Green);
const Yellow = exports.Yellow = 
	new Logger(null, Levels.Standard, Colors.Yellow);
const Blue = exports.Blue = 
	new Logger(null, Levels.Standard, Colors.Blue);
const Magenta = exports.Magenta = 
	new Logger(null, Levels.Standard, Colors.Magenta);
const Cyan = exports.Cyan = 
	new Logger(null, Levels.Standard, Colors.Cyan);
const White = exports.White = 
	new Logger(null, Levels.Standard, Colors.White);

const Standard = exports.Standard = 
	new Logger(null, Levels.Standard, Colors.Default);
const Fatal = exports.Fatal = 
	new Logger('Fatal', Levels.Fatal, Colors.Magenta, Colors.Magenta);
const _Error = exports.Error = 
	new Logger('Error', Levels.Error, Colors.Red, Colors.Red);
const Warn = exports.Warn = 
	new Logger('Warn', Levels.Warn, Colors.Yellow, Colors.Yellow);
const Info = exports.Info = 
	new Logger('Info', Levels.Info, Colors.Blue, Colors.Blue);
const Debug = exports.Debug = 
	new Logger('Debug', Levels.Debug, Colors.Cyan, Colors.Cyan);
const Trace = exports.Trace = 
	new Logger('Trace', Levels.Trace, Colors.Green, Colors.Green);

exports.black = function(){exports.Black.log.apply(exports.Black, arguments)};
exports.red = function(){exports.Red.log.apply(exports.Red, arguments)};
exports.green = function(){exports.Green.log.apply(exports.Green, arguments)};
exports.yellow = function(){exports.Yellow.log.apply(exports.Yellow, arguments)};
exports.blue = function(){exports.Blue.log.apply(exports.Blue, arguments)};
exports.magenta = function(){exports.Magenta.log.apply(exports.Magenta, arguments)};
exports.cyan = function(){exports.Cyan.log.apply(exports.Cyan, arguments)};
exports.white = function(){exports.White.log.apply(exports.White, arguments)};
exports.standard = function(){exports.Standard.log.apply(exports.Standard, arguments)};
exports.fatal = function(){exports.Fatal.log.apply(exports.Fatal, arguments)};
exports.error = function(){exports.Error.log.apply(exports.Error, arguments)};
exports.warn = function(){exports.Warn.log.apply(exports.Warn, arguments)};
exports.info = function(){exports.Info.log.apply(exports.Info, arguments)};
exports.debug = function(){exports.Debug.log.apply(exports.Debug, arguments)};
exports.trace = function(){exports.Trace.log.apply(exports.Trace, arguments)};
