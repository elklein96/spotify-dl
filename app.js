var express = require('express');
var request = require('request');
var http = require('http');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;

var client_id = '4fe8ca77111f4d3a94759239c0d60507';
var client_secret = 'e93c0bbdb98845e39e83616eba7be98a';
var redirect_uri = 'https://spotify-dl.herokuapp.com/callback';

var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';

var app = express();
var server = http.createServer(app);

app.use(express.static(__dirname + '/public'))
   .use(cookieParser());

console.log('Listening on 8888');
server.listen(80);
server.listen(443);
server.listen(8888);

app.get('/login', function(req, res) {
  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  var scope = 'user-read-private user-read-email';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

app.get('/callback', function(req, res) {
  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        request.get(options, function(error, response, body) {
          console.log(body);
        });

        res.redirect('/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

app.get('/refresh_token', function(req, res) {
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});

app.get('/get-playlists', function(req, res) {
  var playlistOptions = {
    url: 'https://api.spotify.com/v1/users/'+req.query.user_id+'/playlists/',
    headers: { 'Authorization': 'Bearer ' + req.query.access_token },
    json: true
  };

  request.get(playlistOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var playlists = [];

      for(var i=0; i<body.items.length; i++){
        playlists.push({"id": body.items[i].id, "name": body.items[i].name, "link": body.items[i].href});
      }
      console.log("playlists: "+playlists);
      res.send({
        'playlists': playlists
      });
    }
  });
});

app.get('/playlist-tracks', function(req, res) {
  if(req.query.playlist_url.charAt(req.query.playlist_url.length -1) != '/')
    req.query.playlist_url = req.query.playlist_url+"/";

  var playlist_id = req.query.playlist_url.match('playlist\/(.*)\/')[1];

  var playlistOptions = {
    url: 'https://api.spotify.com/v1/users/'+req.query.user_id+'/playlists/'+playlist_id+'/tracks',
    headers: { 'Authorization': 'Bearer ' + req.query.access_token },
    json: true
  };

  request.get(playlistOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var playlist_info = body;
      res.send({
        'playlist_info': playlist_info
      });
    }
  });
});

app.get('/tracks', function(req, res) {
  var io = require('socket.io').listen(server);
  var tracks = req.query.tracks;
  var kill;
  
  function downloadExec(i, socket){
    console.log("Downloading "+tracks[i].link+" at "+i);

    var child  = spawn("youtube-dl", ["--extract-audio", "--audio-format", "mp3", "-o", './public/downloads/%(title)s.%(ext)s', "--restrict-filenames", tracks[i].link]);

    socket.on('terminate', function (data){
      console.log('terminate');
      child.kill();
      i = tracks.length;
      kill = true;
    });

    socket.on('skip', function (data){
      console.log('skip');
      child.kill();
      kill = true;
    });

    child.stdout.on('data', function(data) {
      if(data.toString().indexOf('[download]') > -1){
        socket.emit('progress', {
          track: tracks[i].link.match('=(.*)')[1],
          status: data.toString().match('(?:download])(.*)of')
        });
      }
      if(data.toString().indexOf('[download] Destination') > -1){
        socket.emit('output', {
          file: data.toString().match('(?:Destination: )(.*)\n')[1].replace('m4a', 'mp3')
        });
      }
    });
    
    child.on('exit', function(data) {
      if(!kill){
        socket.emit('download', {
          data: {download: "download"}
        });
      }
      if(++i<tracks.length)
        downloadExec(i, socket);
    });
  }
  io.sockets.on('connection', function (socket) {
    downloadExec(0, socket);
  });
});