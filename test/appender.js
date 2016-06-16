'use strict';

const should = require('chai').should();
const Appender = require('../lib/appender');

describe('Appender', () => {
  it('should have enumerable property "type" to indicate what appender type it is.', () => {
    (new Appender()).type.should.be.a('string');
  });
  it('should have no enumerable properties other than "type".', () => {
    const st = new Set(Object.keys(new Appender()));
    st.delete('type');
    Array.from(st).should.have.length(0);
  });
});
