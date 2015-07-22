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

var rmCache = crontab.scheduleJob("* */1 * * *", function(){
  spawn('find', ['./public/downloads', '-type', 'f', '-mtime', '+1', '-exec', 'rm', '-f', '{}', '\\;']);
});