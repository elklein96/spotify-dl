var request = require('request');
var fs = require('fs');
var spawn = require('child_process').spawn;
var child = spawn('node', ['app.js']);

if(process.platform.indexOf("win") > -1 && process.platform.indexOf("darwin") < 0){
	spawn('start', ['http://localhost:8888'])
}else{
	spawn('open', ['http://localhost:8888']);
}

console.log(process.platform);