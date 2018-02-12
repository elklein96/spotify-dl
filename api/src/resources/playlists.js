const request = require('request');
const querystring = require('querystring');

const envConfig = require('../../config.json');

module.exports = {
    getPlaylists,
    getPlaylistTracks
};

function getPlaylists(req, res, next) {
    const accessToken = req.cookies ? req.cookies[envConfig.auth_cookie_name] : null;

    const playlistOptions = {
        url: 'https://api.spotify.com/v1/users/' + req.query.user_id + '/playlists/',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
        json: true
    };

    request.get(playlistOptions, playlistReceived);

    function playlistReceived(error, response, body) {
        if (error || !body.items) {
            res.status(400).send({ error });
            return next();
        }
        const playlists = body.items.reduce((accumulator, val) => {
            accumulator.push({
                id: val.id,
                name: val.name,
                link: val.href
            });
            return accumulator;
        }, []);
        res.send({ 'data': playlists });
        return next();
    }
}

function getPlaylistTracks(req, res, next) {
    const accessToken = req.cookies ? req.cookies[envConfig.auth_cookie_name] : null;
    const playlistOptions = {
        url: 'https://api.spotify.com/v1/users/' + req.query.user_id + '/playlists/' + req.params.id + '/tracks',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
        json: true
    };
    request.get(playlistOptions, (error, response, body) => {
        if (error) {
            res.status(400).send({ error });
            return next();
        }
        if (body.items && body.items.length) {
            const requestQueue = body.items.map(item => {
                if (item.track && item.track.artists && item.track.artists.length) {
                    const track = item.track;
                    return searchForSong(track.name, track.artists[0].name);
                }
                return { error: 'invalid_song' };
            });
            Promise.all(requestQueue)
                .then(data => {
                    res.send({ 'data': data });
                    return next();
                })
                .catch(error => {
                    res.status(400).send({ error });
                    return next();
                });
        } else {
            res.status(404).send({ 'data': {} });
            return next();
        }
    });
}

function searchForSong(name, artist) {
    const reqOptions = {
        part: 'snippet',
        q: name + ' ' + artist + ' official',
        maxResults: 5,
        key: envConfig.google_api_key
    };
    const queryParams = querystring.stringify(reqOptions);
    const authOptions = {
        url: 'https://www.googleapis.com/youtube/v3/search?' + queryParams,
        json: true
    };
    return new Promise((resolve, reject) => {
        request.get(authOptions, (error, response, body) => {
            if (error) {
                reject(error);
            }
            if (body && body.items && body.items.length) {
                body.items.forEach(video => {
                    if (video.id && video.id.videoId && video.snippet && video.snippet.title)  {
                        const result = {
                            url: 'https://www.youtube.com/watch?v=' + video.id.videoId,
                            name: video.snippet.title,
                            id: video.id.videoId
                        };
                        resolve(result);
                    }
                });
            }
            reject('not_found');
        });
    });
}
