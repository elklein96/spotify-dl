const request = require('request');
const querystring = require('querystring');

const envConfig = require('../../config.json');

module.exports = {
    logIn,
    oAuthCallback,
    logOut,
    getUserData
};

function logIn(req, res, next) {
    const state = generateRandomString(16);
    const scope = 'user-read-private user-read-email';
    const reqOptions = {
        response_type: 'code',
        client_id: envConfig.spotify_client_id,
        scope: scope,
        redirect_uri: envConfig.redirect_uri,
        state: state
    };

    res.cookie(envConfig.auth_state_cookie_name, state);
    res.header('Location', 'https://accounts.spotify.com/authorize?' + querystring.stringify(reqOptions));
    res.status(302).send();

    return next();
}

function oAuthCallback(req, res, next) {
    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.cookies ? req.cookies[envConfig.auth_state_cookie_name] : null;

    if (state === null || state !== storedState) {
        res.status(403).send({ error: 'state_mismatch' });
        return next();
    } else {
        res.clearCookie(envConfig.auth_state_cookie_name);
        const authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: envConfig.redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' +
                    new Buffer(envConfig.spotify_client_id + ':' + envConfig.spotify_client_secret).toString('base64')
            },
            json: true
        };

        request.post(authOptions, (error, response, body) => {
            if (error) {
                res.status(401).send({ error: 'invalid_token' });
            }
            const accessToken = body.access_token;
            const options = {
                url: 'https://api.spotify.com/v1/me',
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                },
                json: true
            };
            request.get(options, (error, response, body) => {
                if (error) {
                    res.status(401).send({ error: error });
                    return next();
                }
                res.cookie(envConfig.user_cookie_name, JSON.stringify(body));
                res.cookie(envConfig.auth_cookie_name, accessToken);
                res.header('Location', envConfig.base_uri);
                res.status(302).send();

                return next();
            });
        });
    }
}

function logOut(req, res, next) {
    res.clearCookie(envConfig.auth_cookie_name);
    res.clearCookie(envConfig.user_cookie_name);
    return res.status(200).send({ message: 'Ok.' });
}

function getUserData(req, res, next) {
    const accessToken = req.cookies ? req.cookies[envConfig.auth_cookie_name] : null;
    const options = {
        url: 'https://api.spotify.com/v1/me',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
        json: true
    };
    request.get(options, (error, response, body) => {
        if (error) {
            res.status(401).send({ error: error });
            return next();
        }
        res.cookie(envConfig.user_cookie_name, JSON.stringify(body));
        res.send(body);
    });
}

function generateRandomString(length) {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let text = '';
  
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}
