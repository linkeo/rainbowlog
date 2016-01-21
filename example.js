var log = require('./index.js');

// log.DebugMode = false;
log.black('this is a black message.');
log.red('tomato ketchup');
log.green('Test all green');
log.yellow('honey~~~');
log.blue('https://github.com');
log.magenta('this is a magenta message.');
log.cyan('Water is cold.');
log.white('White message...');
log.standard('Standard ouput');
log.fatal('Database is not reachable', {url: "mongodb://localhost/test"});
log.error('Duplicate key', {key: "name", table: "user"});
log.warn('Your phonenumber %s is not a valid chinese phone number.', '9135910341034');
log.info('User %s(#%d) logged in.', 'leocm', 151);
log.debug('Got %d items from list', 15); // will not display if DebugMode==false
log.trace('Visit %s %s', 'POST', '/user/register'); // will not display if DebugMode==false