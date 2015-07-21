var request = require('request');
var fs = require('fs');
var spawn = require('child_process').spawn;

var browser;
var isWin = /^win/.test(process.platform);
var child = spawn('node', ['app.js']);

isWin ? browser = spawn('start', ['""', 'http://localhost:8888']) : browser = spawn('open', ['http://localhost:8888']);

child.stdout.on('data', function(data) {
  console.log(data.toString());
});