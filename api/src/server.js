const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fixPath = require('fix-path');
const http = require('http');
const path = require('path');

const errorHandler = require('./core/error-handler');
const auth = require('./resources/authentication');
const playlists = require('./resources/playlists');

fixPath();

const app = express();

app.server = http.createServer(app);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3002');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    return next();
});

app.use(errorHandler.logErrors);
app.use(errorHandler.sendError);

app.use('/downloads', express.static(path.join(__dirname, '/../downloads')));

app.get('/api/playlists', playlists.getPlaylists);
app.get('/api/playlists/:id', playlists.getPlaylistTracks);
app.get('/api/login', auth.logIn);
app.delete('/api/login', auth.logOut);
app.get('/api/callback', auth.oAuthCallback);
app.get('/api/user', auth.getUserData);

app.server.listen(process.env.PORT || 3001);
console.log(`Express server listening on port ${app.server.address().port}`);

module.exports = app;
require('./resources/download');