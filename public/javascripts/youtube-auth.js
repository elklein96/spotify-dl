var OAUTH2_CLIENT_ID = '180259427148-bc2c3r2eq3bmrjvn02v1arvvhn4uuend.apps.googleusercontent.com';
var OAUTH2_SCOPES = [
  'https://www.googleapis.com/auth/youtube'
];

googleApiClientReady = function() {
  gapi.auth.init(function() {
    window.setTimeout(checkAuth, 1);
  });
}

function checkAuth() {
  gapi.auth.authorize({
    client_id: OAUTH2_CLIENT_ID,
    scope: OAUTH2_SCOPES,
    immediate: true
  }, handleAuthResult);
}

function handleAuthResult(authResult) {
  if (authResult && !authResult.error) {
    loadAPIClientInterfaces();
  } else {
    gapi.auth.authorize({
      client_id: OAUTH2_CLIENT_ID,
      scope: OAUTH2_SCOPES,
      immediate: false
    }, handleAuthResult);
  }
}

function loadAPIClientInterfaces() {
  gapi.client.load('youtube', 'v3', function() {
  });
}