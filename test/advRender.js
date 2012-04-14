var should = require('should');
var liquid = require('../');

describe('advRender', function () {
  
  it('#advRender', function (done) {
    
    var models = {
      'title':    function (callback) {
        setTimeout(function () {
          return callback(null, '����');
        }, 50);
      },
      'man.name':    function (callback) {
        setTimeout(function () {
          return callback(null, '����');
        }, 100);
      },
      'man.age':    function (callback) {
        setTimeout(function () {
          return callback(null, '23');
        }, 50);
      },
      'error':    function (callback) {
        throw Error();
      }
    };
    
    var fn = liquid.compile('{{ title }}: ����:{{ man.name }}, ����:{{ man.age }}');
    liquid.advRender(fn, models, {}, function (err, text) { 
      should.not.exist(err);
      text.should.equal('����: ����:����, ����:23');
      
      var fn = liquid.compile('{{ title }}: {{ error }}');
      liquid.advRender(fn, models, {}, function (err, text) { 
        should.exist(err);
        
        done();
      });
    });
  });
  
});