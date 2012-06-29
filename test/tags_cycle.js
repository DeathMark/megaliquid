var should = require('should');
var liquid = require('../');

describe('Liquid.js', function () {
  
  it('#cycle', function () {
  
    var render = function (text, data, filters) {
      //console.log(liquid.parse(text).code);
      var fn = liquid.compile(text);
      //console.log(fn.toString());
      var html = fn(data, filters);
      return html;
    }
    /*
    // ʹ���ַ���
    render("{% cycle 'one', 'two', 'three' %},\
{% cycle 'one', 'two', 'three' %},\
{% cycle 'one', 'two', 'three' %},\
{% cycle 'one', 'two', 'three' %}")
    .should.equal('one,two,three,one');
    
    // ʹ������
    render("{% cycle 1, 2, 3 %},\
{% cycle 1, 2, 3 %},\
{% cycle 1, 2, 3 %},\
{% cycle 1, 2, 3 %}")
    .should.equal('1,2,3,1');
    
    // ʹ�ñ��� ����������Ⱦ֮ǰ��ȷ���ı�����
    render("{% cycle a, b, c %},\
{% cycle a, b, c %},\
{% cycle a, b, c %},\
{% cycle a, b, c %}", {a: 'Fo', b: 2, c: 'WwZ'})
    .should.equal('Fo,2,WwZ,Fo');
      
    // ѭ��
    render("{% cycle 'one', 'two', 'three' %},\
{% for item in (1..3) %}\
{%  cycle 'one', 'two', 'three' %},\
{% endfor %}\
{%  cycle 'one', 'two', 'three' %}")
    .should.equal('one,two,three,one,two');
    
    // Ƕ��ѭ��
    render("{% cycle 'one', 'two', 'three' %},\
{% for item in (1..3) %}\
{% for item in (1..3) %}\
{%  cycle 'one', 'two', 'three' %},\
{% endfor %}\
{% endfor %}\
{%  cycle 'one', 'two', 'three' %}")
    .should.equal('one,two,three,one,two,three,one,two,three,one,two');
    */
    // ����
    render("{% for item in (1..3) %}{% cycle 'group 1': 'one', 'two', 'three' %},{% endfor %}")
      .should.equal('one,two,three,');
    render("{% for item in (1..6) %}{% cycle 'group 1' : 'one', 'two', 'three' %},{% endfor %}")
      .should.equal('one,two,three,one,two,three,');
  });
});