# RainbowLog v2

[![Build Status](https://travis-ci.org/linkeo/rainbowlog.svg?branch=master)](https://travis-ci.org/linkeo/rainbowlog)

Simple Logging Package for Node.js.

- [x] simple to use.
- [x] print with color in unix terminals.
- [x] customizable levels.
- [x] customizable timestamp.
- [x] can persist to file.
- [x] support seperating file by size or time (in hours or days).

> **Notice**: Colorfying only works in Unix-based systems.



## Installation

```sh
npm install --save rainbowlog
```



## Usage

### 1. Use Default Logger

We provide a default logger for common usage.

```js
const log = require('rainbowlog');

log.trace('hello log');
log.debug('hello', 'log');
log.info('%s %s', 'hello', 'log');
log.warn();
log.error(); // print to process.stderr
log.fatal(); // print to process.stderr
```

These functions take the same arguments as [`console.log` in Node.js](https://nodejs.org/api/console.html#console_console_log_data).

> The default logger is configured to be console-only in dev environment. And in prod environment, it prints to both console and files (log files are located in 'logs' directory from current working directory ([`process.cwd()`](https://nodejs.org/api/process.html#process_process_cwd)))
>
> We distinguish environments via [`isprod`](https://github.com/linkeo/isprod) package. Basically you can use environment `NODE_ENV=prod` or pass `--prod` to the program to announce a prod environment.



### 2. Use Provided Logger

We have provided a few loggers for common usage.

Let's take a quick look:

```js
const {Logger} = require('rainbowlog');

const consl = Logger.Console // log all to process.stdout
consl.error(); // print to process.stdout

const logclr = Logger.Colors // levels are color names. only print messages.
logclr.red(); // print red messages.
```

>   You can provide some default logger if you think it is common. Welcome to talk about it in issue.



### 3. Customize Loggers

You can define loggers to fit your proposes.

```js
const {Logger, Appender} = require('rainbowlog');
const path = require('path');

const log = new Logger({
  format: {
    taglength: 3, // display 'network' as 'net'
  },
  levels: { // customize levels here
    network: 'cyan',
    logic: 'blue',
    render: 'green',
    warn: 'warn',
    error: 'red',
  },
  appenders: [
    Appender.Console, // print all message to stdout
    {                 // save network records to files in cwd/network-logs
      type: 'file',
      filepath: path.join(process.cwd(), 'network-logs'),
      filename: 'network',
      levels: ['network']
    },
    {                 // save message expect errors to files in cwd/logs
      type: 'file',
      filepath: path.join(process.cwd(), 'logs'),
      filename: 'output',
      levels: ['logic', 'render']
    },
    {                 // save errors to files in cwd/error-logs
      type: 'file',
      filepath: path.join(process.cwd(), 'error-logs'),
      filename: 'errors',
      levels: ['warn', 'error']
    },
  ]
});

// record network in express.js
app.use((req, res, next) => {
  log.network(req.ip, req.url);
});
```

>   **Notice**: Appender.Prod, Append.Stdout, Append.Stderr are defined with levels, should not be used if your want to customize levels.
>
>   Instead, you should pass streams to appender.



### Conceptions

We have these objects for different aims:

1. **logger**: to be used in use program, call functions to log messages.
2. **appender**: to append(write) an well formatted message to output, such as console, files, etc.

Other conceptions:

1.  **chunk**: we use 'chunk' to stand for separated file partitions/rotating.



## Document

### class: Logger

Loggers are used to log messages for users.

you can call level-log methods by level names.

> new Logger(options)

options:

- **format** *object* :

  - **line** *string* : Customize output message, default as `${time} ${tag} ${output}`.
    - `${time}` : replaced by timestamp.
    - `${tag}` : replaced by a styled tag indicating log level.
    - `${output}` : **required**. replaced by user message.

  - **timeFormat** *string* : Customize output message, default as `YYYY-MM-DD HH:mm:ss.SSS` , directly passed to [moment.js](http://momentjs.com/docs/#/displaying/format/)
  - **tagStyle** *string* : Configure tag style, available values are `background` (default) , `bracket` , `hidden` , `plain` .
  - **tagLength** *number* : To be used as tag, level name will truncated by this option. default to `5`.


- **levels** *object* : Customize log levels, this is a key-value object, keys stand for levels and values stand for color of corresponding level.

  >   Available colors are:
  >
  >   -   black, red, green, yellow, blue, magenta, cyan, white
  >   -   blackBright, redBright, greenBright, yellowBright, blueBright, magentaBright, cyanBright, whiteBright
  >
  >   Default levels:
  >
  >   -   trace - green
  >   -   debug - cyan
  >   -   info - blue
  >   -   warn - yellow
  >   -   error - red
  >   -   fatal - magenta

- **appenders** *array* : appenders can be instances of Appender or appender options objects. instances are used directly, while options will used to construct new Appender instances. See 'Appender'.

  >   **Notice**: If you want to share same output file in different loggers, you should pass instance in this options.



> logger.log(level: string, …message)

In principle, This method should **not** be called by users.



#### Constants

-   Logger.Console

    *Configured with default levels, only log to console.*


-   Logger.Colors

    *Configured with color names as levels, only log to console.*


-   Logger.Standard

    *Configured with default levels, log levels lower than 'error' to stdout, error levels ('error' and 'fatal') to stderr.*


-   Logger.Prod

    *Configured with default levels, log to console and file, file appender are configured with default path, named as 'prod', seperating by default size limit and 1-day time limit.*



### class: Appender

Appenders are used to append messages to output.

>   new Appender(options)

options:

-   **levels** *array | 'all'* : Pass an array of level names to tell appender to allow these levels **only** to be appended to output. Optionally, you can pass string 'all' to indicate accept all levels. Default as 'all'.


-   **stream** *writable stream* : You can provide an writable stream to be appended. If stream is provided, options below will be ignored. (means only stream and levels will be considered)

    >   *"If stream is provided, other options will be ignored."*
    >
    >   It means, user provided streams are not supported with chunk (rotating).


-   **type** *string* : Available values: 'console', 'file'. Should omit it while stream is provided.

      >   if type is set to console, appender will append messages to stdout. and need no more options below.

-   **filename** *string* : **Only useful for type 'file'.** Set a prefix of log files (Final filename will contain chunk message such as time or chunk number). Default as 'output'.

-   **filepath** *string* : **Only useful for type 'file'.** Set the directory to save log files. Default as 'logs' directory to 'cwd'.

-   **chunkTime** *number | string* : **Only useful for type 'file'.** Set a period for seperating output file into chunks, available time unit are 'days' and 'hours'. If you pass an number, it will treat as seconds. Default as null.

    >   For example, you can pass '1 hour', '4 hours', '9h', '1d', '7days' or 24 * 3600 * 1000.

-   **chunkSize** *number | string* : **Only useful for type 'file'.** Set a size limit to file chunks. available size unit are 'b', 'kb', 'mb', 'gb'. Numbers are treat as bytes. Default as 64mb.

    >   For example, you can pass '64m', '16mb', '8 kb', '1024000 bytes' or 1024000.



#### Constants:

-   Appender.Console

    *The Console Appender.*


-   Appender.DefaultFileAppender

    *File appender configured with default options. (seperate by size limit only).*


-   Appender.DailyFileAppender

    *File appender configured to seperate by 1-day time limit only.*


-   Appender.Prod

    *File appender configured for Logger.*Prod.
