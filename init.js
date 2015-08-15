var request = require('request');
var fs = require('fs');
var spawn = require('child_process').spawn;
var crontab = require('node-crontab');

var browser;
var child = spawn('node', ['app.js']);

process.platform === "win32" ? browser = spawn('start', ['http://localhost:8888']) : browser = spawn('open', ['http://localhost:8888']);

child.stdout.on('data', function(data) {
  console.log(data.toString());
});

spawn('find', ['./public/downloads', '-type', 'f', '-mmin', '+59', '-exec', 'rm', '-f', '{}', '\\;']);