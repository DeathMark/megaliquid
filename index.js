/**
 * ģ������
 *
 * @author ����<leizongmin@gmail.com>
 */
 
// �汾
exports.version = '0.0.1';
 
// ��������
exports.parse = require('./lib/template').parse;

// ���뺯��
exports.compile = require('./lib/template').compile;

// ��Ⱦ����
exports.render = require('./lib/template').render;

// ��������ģ��
exports.compileAll = require('./lib/advtemplate').compileAll;

// �߼���Ⱦ
exports.advRender = require('./lib/advtemplate').advRender;

// ת��Ϊ�߼���Ⱦ����
exports.toAdvRender = require('./lib/advtemplate').toAdvRender;

// ������
exports.filters = require('./lib/filters');

