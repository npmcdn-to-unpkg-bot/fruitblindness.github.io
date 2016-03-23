/* */ 
var should = require('should');
describe('canUseDOM', function() {
  it('should return false in nodejs environment', function(done) {
    var canUseDOM = require('./index');
    canUseDOM.should.be.false;
    done();
  });
});
