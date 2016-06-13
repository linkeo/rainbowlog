'use strict';

const log = require('./index.js');
const clog = log.Logger.Colors;

// log.prod = true;
clog.black('this is a black message.');
clog.red('tomato ketchup');
clog.green('Test all green');
clog.yellow('honey~~~');
clog.blue('https://github.com');
clog.magenta('this is a magenta message.');
clog.cyan('Water is cold.');
clog.white('White message...');
log.fatal('Database is not reachable', {url: "mongodb://localhost/test"});
log.error('Duplicate key', {key: "name", table: "user"});
log.warn('Your phonenumber %s is not a valid chinese phone number.', '9135910341034');
log.info('User %s(#%d) logged in.', 'leocm', 151);
log.debug('Got %d items from list', 15); // will not display if DebugMode==false
log.trace('Visit %s %s', 'POST', '/user/register'); // will not display if DebugMode==false
