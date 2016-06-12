const Appender = require('./appender');

const a = new Appender({
  type: 'file',
  chunkTime: '1h',
  chunkSize: '160b',
});

a.append('default', 'hello rainbowlog\n');
