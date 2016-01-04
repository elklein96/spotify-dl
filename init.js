var request = require('request');
var fs = require('fs');
var spawn = require('child_process').spawn;
var crontab = require('node-crontab');
var child = spawn('node', ['app.js']);

if(process.platform.indexOf("win") > -1){
	spawn('start', ['http://localhost:8888'])
}else{
	spawn('open', ['http://localhost:8888']);
	spawn('find', ['./public/downloads', '-type', 'f', '-mmin', '+59', '-exec', 'rm', '-f', '{}', '\\;']);
}

console.log(process.platform);

child.stdout.on('data', function(data) {
  console.log(data.toString());
});