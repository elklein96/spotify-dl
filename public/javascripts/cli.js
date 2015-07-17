$.getScript("/javascripts/youtube-auth.js", function(){
  alert("Script loaded and executed.");
});

$.getScript("//apis.google.com/js/client.js?onload=googleApiClientReady", function(){
  alert("Script loaded and executed.");
});

(function() {
  function getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }
  var params = getHashParams();

  var access_token = params.access_token,
      refresh_token = params.refresh_token,
      error = params.error;

  var userId;

  if (error) {
    alert('There was an error during the authentication');
  } else {
    if (access_token) {
      $.ajax({
          url: 'https://api.spotify.com/v1/me',
          headers: {
            'Authorization': 'Bearer ' + access_token
          },
          success: function(response) {
            userInfo = response.id;
            console.log("Successfully logged in.");
          }
      });
    } else {
        console.log("Error. Please log in again.");
    }

    function getPlaylist(){
      var tracks = [];
      var trackLinks = [];

      function matchLinks(link){
        console.log(link);
        trackLinks.push({"link": link});
        if(trackLinks.length === tracks.length){
          $.ajax({
            url: '/tracks', 
            data: {
              'tracks': trackLinks
            }
          });
        }
      }

      $.ajax({
        url: '/refresh_token',
        data: {
          'access_token': access_token,
          'refresh_token': refresh_token
        }
      }).done(function(data) {
        access_token = data.access_token;
        $.ajax({
          url: '/playlist',
          data: {
            'access_token': access_token,
            'user_id': userId,
            'playlist_url': document.getElementById('playlist-link').value
          }
        }).done(function(data) {
          for(var i=0; i<data.playlist_info.items.length; i++){
            tracks[i] = { "name": data.playlist_info.items[i].track.name, "artist": data.playlist_info.items[i].track.artists[0].name};
          }

          for(var i=0; i<tracks.length; i++){
            var request = gapi.client.youtube.search.list({
              q: tracks[i].name+" "+tracks[i].artist,
              maxResults: 10,
              part: 'snippet'
            });
            request.execute(function(response) {
              matchLinks("https://www.youtube.com/watch?v="+response.result.items[0].id.videoId);
            });
          }
        });
      });
    }
  }
})();