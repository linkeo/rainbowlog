'use strict';

const should = require('chai').should();
const log = require('../index');

describe('rainbowlog', () => {
  describe('default logger', () => {
    it('log functions should be called without exception.', () => {
      log.trace();
      log.debug();
      log.info();
      log.warn();
      log.error();
      log.fatal();
    });
    it('log functions should be called without exception with formatting text.', () => {
      log.trace('%d%%', 80);
      log.debug('%d%%', 80);
      log.info('%d%%', 80);
      log.warn('%d%%', 80);
      log.error('%d%%', 80);
      log.fatal('%d%%', 80);
    });
    it('log functions should be called without exception with multiple arguments (not string only).', () => {
      log.trace(80, {hello: 'world'}, ['hello', 'world'], 'hello world');
      log.debug(80, {hello: 'world'}, ['hello', 'world'], 'hello world');
      log.info(80, {hello: 'world'}, ['hello', 'world'], 'hello world');
      log.warn(80, {hello: 'world'}, ['hello', 'world'], 'hello world');
      log.error(80, {hello: 'world'}, ['hello', 'world'], 'hello world');
      log.fatal(80, {hello: 'world'}, ['hello', 'world'], 'hello world');
    });
  });
});
