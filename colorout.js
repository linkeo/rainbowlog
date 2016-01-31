const Colors = exports.Colors = {
	black		: 30,
	red 		: 31,
	green 		: 32,
	yellow 		: 33,
	blue 		: 34,
	magenta 	: 35,
	cyan 		: 36,
	white 		: 37
};

const Backgrounds = exports.Backgrounds = {
	black		: 40,
	red 		: 41,
	green 		: 42,
	yellow 		: 43,
	blue 		: 44,
	magenta 	: 45,
	cyan 		: 46,
	white 		: 47
}

function TextColor(tclr, str) {
	if (require('os').platform() === "win32") { // windows
		return str
	}
	if (tclr>=30 && tclr<=37)
		return '\x1b[0;'+tclr+'m'+str+'\x1b[0m';
	else
		return str;
}

function TextBackground(tbg, str) {
	if (require('os').platform() === "win32") { // windows
		return str
	}
	if (tbg>=40 && tbg<=47)
		return '\x1b[7;'+tbg+'m'+str+'\x1b[0m';
	else
		return str;
}

function TextColorWithBackground(tclr, tbg, str) {
	if (require('os').platform() === "win32") { // windows
		return str
	}
	var fgok = tclr>=30 && tclr<=37;
	var bgok = tbg>=40 && tbg<=47;
	if (fgok && bgok) // fg ok
		return '\x1b[0;'+tclr+';'+tbg+'m'+str+'\x1b[0m';
	else if (fgok) 
		return '\x1b[0;'+tclr+'m'+str+'\x1b[0m';
	else if (bgok)
		return '\x1b[7;'+tbg+'m'+str+'\x1b[0m';
	else
		return str;
}

function Black (str) { return TextColor(Colors.black, str) }
function Red (str) { return TextColor(Colors.red, str) }
function Green (str) { return TextColor(Colors.green, str) }
function Yellow (str) { return TextColor(Colors.yellow, str) }
function Blue (str) { return TextColor(Colors.blue, str) }
function Magenta (str) { return TextColor(Colors.magenta, str) }
function Cyan (str) { return TextColor(Colors.cyan, str) }
function White (str) { return TextColor(Colors.white, str) }

exports.TextColor = TextColor;
exports.TextBackground = TextBackground;
exports.TextColorWithBackground = TextColorWithBackground;
exports.black = Black;
exports.red = Red;
exports.green = Green;
exports.yellow = Yellow;
exports.blue = Blue;
exports.magenta = Magenta;
exports.cyan = Cyan;
exports.white = White;