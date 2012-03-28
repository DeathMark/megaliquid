/**
 * ��ģ������
 */
 



var $_escape = function(html){
  return String(html)
    .replace(/&(?!\w+;)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

var outputHtml = function (html) {
  return html.replace(/\\/img, '\\')
             .replace(/'/img, '\\\'')
             .replace(/"/img, '\\\"')
             .replace(/\r/img, '\\r')
             .replace(/\n/img, '\\n');
}
 
/**
 * �������
 *
 * @param {string} text
 * @return {string}
 */
exports.parse = function (text) {
  var line_number = 0; // �к�
  var html_start = 0;  // HTML���뿪ʼ
  var scripts = [];    // �����Ĵ���
  var context = {}     // ����ʱ���ݵĻ�������
  
  // ��ʼ�����뻷��
  context.loop = 0;    // { Ƕ�ײ���
  
  for (var i = 0, len; len = text.length, i < len; i++) {
    var block = text.substr(i, 3);
    if (text[i] = '\n')
      line_number++;
    
    switch (block) {     
      // ����
      case '{{ ':
        var ret = parseValue(text, i, context);
        break;     
      // ���
      case '{% ':
        var ret = parseSentence(text, i, context);
        break;  
      // ����
      default:
        var ret = null;
    }
    
    if (ret !== null) {
      //console.log(ret);
      var html = text.slice(html_start, ret.start);
      html = outputHtml(html);
      scripts.push('$_buf.push(\'' + html + '\');');
      scripts.push(ret.script);
      i = ret.end;
      html_start = ret.end;
    }
  }
  
  // ���һ���ֵ�HTML
  var html = text.slice(html_start, len);
  html = outputHtml(html);
  scripts.push('$_buf.push(\'' + html + '\');');
  
  var wrap_top =    '/* easytpl */\n'
               +    'var $_buf = [];\n'
               +    'var $_escape = ' + $_escape.toString() + '\n';
  var wrap_bottom = '\n/* easytpl */';
  
  return wrap_top + scripts.join('\n') + wrap_bottom;
}

var parseValue = function (text, start, context) {
  // ���ҽ������
  var end = text.indexOf(' }}', start);
  if (end === -1)
    return null;
  
  // ����������Ƿ�Ϊͬһ�е�
  var lineend = text.indexOf('\n', start);
  if (lineend > -1 && lineend < end)
    return null;
  
  var line = text.slice(start + 3, end).trim();
  end += 3;
  
  // :varname Ϊ��ִ��escape()ת��
  if (line[0] === ':') {
    var script = '$_buf.push(' + line.substr(1) + ');';
  }
  else {
    var script = '$_buf.push($_escape(' + line + '));';
  }
  return {start: start, end: end, script: script};
}

var parseSentence = function (text, start, context) {
  // ���ҽ������
  var end = text.indexOf(' %}', start);
  if (end === -1)
    return null;
    
  // ����������Ƿ�Ϊͬһ�е�
  var lineend = text.indexOf('\n', start);
  if (lineend > -1 && lineend < end)
    return null;
 
  var line = text.slice(start + 3, end).trim();
  end += 3;
  
  // �����������
  var space_start = line.indexOf(' ');
  var script = '';
  
  // �����
  if (space_start === -1) {
    switch (line) {
      // ѭ��/�����жϽ���
      case 'end':
      case 'endfor':
      case 'endif':
      case 'endwhile':
        script = '}';
        context.loop--;
        break;
      case 'else':
        script = '} else {';
        break;
      // ����
      default:
        script = sentenceError(line);
    }
  }
  // ����
  else {
    var line_left = line.substr(0, space_start);
    var line_right = line.substr(space_start).trim();
    switch (line_left) {
      // if/while �ж�
      case 'if':  
      case 'while':
        context.loop++;
        script = line_left + ' (' + line_right + ') {';
        break;
      // for ѭ��
      case 'for':
        context.loop++;
        var blocks = line_right.split(/\s+/);
        // {% for arrays %}
        if (blocks.length === 1) {
          var vn = '$_loop_' + context.loop;
          script = 'for (var ' + vn + ' in ' + blocks[0] + ') {\n'
                 + 'var item = ' + blocks[0] + '[' + vn + '];';
        }
        // {% for item in arrays %}
        else if (blocks.length === 3) {
          var vn = '$_loop_' + context.loop;
          script = 'for (var ' + vn + ' in ' + blocks[2] + ') {\n'
                 + 'var ' + blocks[0] + ' = ' + blocks[2] + '[' + vn + '];';
        }
        // ����
        else {
          script = sentenceError(line);
        }
        break;
      // else if �ж�
      case 'else':
        if (line_right.substr(0, 3) === 'if ') {
          script = '} else if (' + line_right.substr(3).trim() + ') {';
        }
        else {
          script = sentenceError(line);
        }
        break;
      // ɸѡ��  first: arrays
      default:
        if (line_left.substr(-1) === ':') {
          var name = 'filters.' + line_left.substr(0, line_left.length - 1);
          script = name + '(' + line_right + ');';
        }
        else {
          script = sentenceError(line);
        }
    }
  }
  
  return {start: start, end: end, script: script}
}


/**
 * �������
 *
 * @param {string} text
 * @return {function}
 */
exports.compile = function (text) {
  var script = '(function (locals) { \n'
             + 'with (locals) {\n'
             + '  try { \n'
             + exports.parse(text) + '\n'
             + '    return $_buf.join(\'\');\n'
             + '  } catch (err) {\n'
             + '    throw Error(err);\n'
             + '  }\n'
             + '}\n'
             + '})';
  console.log(script);
  return eval(script);
}

var sentenceError = function (msg) {
  msg = outputHtml('<div style="font-weight:bold; font-size:14px; color:red">'
                  + 'Compile error: ' + msg + '<div>');
  var script = '$_buf.push(\'' + msg + '\');';
  return script;
}