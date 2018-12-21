var tracks_s;
var tracks_m;
var tracks_l;
var artists_s;
var artists_m;
var artists_l;



function getHashParams() {
  var hashParams = {};
  var e, r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
  while ( e = r.exec(q)) {
     hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
}

const SHORT_TERM = 'short_term';
const MEDIUM_TERM = 'medium_term';
const LONG_TERM = 'long_term';

const TRACKS = 'tracks';
const ARTISTS = 'artists';

var params = getHashParams();
var LOCALSTORAGE_ACCESS_TOKEN_KEY = 'spotify-audio-analysis-playback-token';
var LOCALSTORAGE_ACCESS_TOKEN_EXPIRY_KEY = 'spotify-audio-analysis-playback-token-expires-in';
var accessToken = localStorage.getItem(LOCALSTORAGE_ACCESS_TOKEN_KEY);
if(!accessToken || parseInt(localStorage.getItem(LOCALSTORAGE_ACCESS_TOKEN_EXPIRY_KEY)) < Date.now()) {
  window.location = '/';
}

var access_token = localStorage.getItem(LOCALSTORAGE_ACCESS_TOKEN_KEY);
var refresh_token = params.refresh_token;
var error = params.error;
var isAuthenticated = false;

//Authentication
authenticate();

function authenticate() {
  if (error) {
    alert('There was an error during the authentication');
  } else {
    if (access_token) {
      $.ajax({
          url: 'https://api.spotify.com/v1/me/', //test connection
          headers: {
            'Authorization': 'Bearer ' + access_token
          },
          success: function(response) {
              isAuthenticated = true;
          }
      });
    } 
  }
}

document.getElementById('get-tracks-s').addEventListener('click', function() {
  $("#track-chart-buttons").children().removeClass("active");
  $("#get-tracks-s").addClass("active");
  tracks_s.update();
  tracks_s.display();                                       
});

document.getElementById('get-tracks-m').addEventListener('click', function() {
  $("#track-chart-buttons").children().removeClass("active");
  $("#get-tracks-m").addClass("active");
  getSpotifyItems(access_token, TRACKS, MEDIUM_TERM);                                       
});

document.getElementById('get-tracks-l').addEventListener('click', function() {
  $("#track-chart-buttons").children().removeClass("active");
  $("#get-tracks-l").addClass("active");
  getSpotifyItems(access_token, TRACKS, LONG_TERM);                                       
});

document.getElementById('get-artists-s').addEventListener('click', function() {
  $("#artist-chart-buttons").children().removeClass("active");
  $("#get-artists-s").addClass("active");
  getSpotifyItems(access_token, ARTISTS, SHORT_TERM);                                       
});

document.getElementById('get-artists-m').addEventListener('click', function() {
  $("#artist-chart-buttons").children().removeClass("active");
  $("#get-artists-m").addClass("active");
  getSpotifyItems(access_token, ARTISTS, MEDIUM_TERM);                                       
});

document.getElementById('get-artists-l').addEventListener('click', function() {
  $("#artist-chart-buttons").children().removeClass("active");
  $("#get-artists-l").addClass("active");
  getSpotifyItems(access_token, ARTISTS, LONG_TERM);                                       
});


function getSpotifyItems(access_token, type, duration) {
  if (isAuthenticated) {
    $.ajax({
      url: 'https://api.spotify.com/v1/me/top/' + type + '?' + 'time_range=' + duration + '&limit=50',
      headers: {
        'Authorization': 'Bearer ' + access_token
      },
      success: function(response) {
        $(".recommendations").show();
        if (type === 'tracks') {
          mapOverTracks(response.items);
        } else {
          mapOverArtists(response.items);
        }
      }
    });
  } else {
    authenticate();
  }
  
}

function mapOverTracks(items) {
    var currentChart = $("#track-chart");
    currentChart.empty();

    var index = 0;
    items.map( function(song) {
        index++;
        var tableRow = $("<tr></tr>");
        
        
        var number = $("<td></td>");
        number.text(index);
        tableRow.append(number);
        
        var track = $("<td></td>");
        track.text(song.name);
        tableRow.append(track);

        var artist = $("<td></td>");
        artist.text(song.artists[0].name);
        tableRow.append(artist);

        currentChart.append(tableRow);


    });
}

function mapOverArtists(items) {
    var currentChart = $("#artist-chart");
    currentChart.empty();

    var index = 0;
    items.map( function(artist) {
        index++;
        var tableRow = $("<tr></tr>");
        var number = $("<td></td>");
        var track = $("<td></td>");

        number.text(index);
        tableRow.append(number);

        track.text(artist.name);
        tableRow.append(track);

        currentChart.append(tableRow);
      
    });
}

  