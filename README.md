# RainbowLog

Log with color.

> Only work in Unix-based systems.

#### Progress

- [x] Format Output, Multi-levels.
- [ ] Print `error(...args)`, `fatal(...args)` to stderr.
- [ ] Write to log file, split by day(split at 00:00).

## Usage

```js
var log = require('rainbowlog');

log.prod = true; // default to false

log.log('standard output with timestamp'); // 2016-01-21 03:54:56.503 standard output with timestamp
log.debug('debugging output %s', 'haha'); // 2016-01-21 03:54:56.505  [Debug]  debugging output haha
```

## Logging Functions

Logging functions receive the same arguments as `console.log(...args)`;

- Formatted Output: `log.log('Cost: $%d', 19.4)` prints `Cost: $19.4` after timestamp;
- Not Formatted Output: `log.log('Cost:', '$', 19.4)` prints `Cost: $ 19.4` after timestamp (If arguments not match formatted output, just join all arguments with space ` `).

### Simple output

Prepend timestamp only.

- `log(...args)`, equivalent to `standard(...args)`

### Colored Output

Prepend timestamp and color the text for output.

- `black(...args)`
- `red(...args)`
- `green(...args)`
- `yellow(...args)`
- `blue(...args)`
- `magenta(...args)`
- `cyan(...args)`
- `white(...args)`

### Multi-level Output

Prepend timestamp and a level tag, also color the output text.

- `trace(...args)`
- `debug(...args)`
- `info(...args)`
- `warn(...args)`
- `error(...args)`
- `fatal(...args)`

## Example

```js
// test.js
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
```

Prints:

![screenshot.png](screenshot.png)