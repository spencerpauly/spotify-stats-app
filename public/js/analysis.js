const Duration = {
    SHORT: {
        NAME: "short_term",
        NUM: 0
    },
    MEDIUM: {
        NAME: "medium_term",
        NUM: 1
    },
    LONG: {
        NAME: "long_term",
        NUM: 2
    }
}

const Type = {
    TRACK: "tracks",
    ARTIST: "artists"
}


var tracks = [];
var artists = [];

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
var isAuthenticated;
var myId;
var currentDuration;
var currentTrackNum;

//Authentication

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
              myId = response.id;
              isAuthenticated = true;
              $("#get-tracks-l").delay(2000).trigger('click');
              $("#get-artists-l").delay(3000).trigger('click');
          }
      });
    } 
  }
}

const BtnFadeIn = 1200;
const downloadBtnFadeIn = 4000;


document.getElementById('get-tracks-s').addEventListener('click', function() {
    $("#track-chart-wrapper").fadeIn(BtnFadeIn);
    $("#track-chart-buttons").children().removeClass("active");
    $("#get-tracks-s").addClass("active");
    currentDuration = "Short Term";
    currentTrackNum = 0;
    if (tracks[0] === undefined) {
        getSpotifyItems(tracks, Type.TRACK, Duration.SHORT.NAME, Duration.SHORT.NUM);
    } else {
        displayItems(tracks[0], Type.TRACK);
    }
    $("#term-length").text(currentDuration);
    $("#track-download-btn").removeClass("disabled");
    $("#track-download-btn").prop('disabled', false);
    $("#download-btn-wrapper").fadeIn(downloadBtnFadeIn);
    
});

document.getElementById('get-tracks-m').addEventListener('click', function() {
    $("#track-chart-wrapper").fadeIn(BtnFadeIn);
    $("#track-chart-buttons").children().removeClass("active");
    $("#get-tracks-m").addClass("active");
    currentDuration = "Medium Term";
    currentTrackNum = 1;
    if (tracks[1] === undefined) {
        getSpotifyItems(tracks, Type.TRACK, Duration.MEDIUM.NAME, Duration.MEDIUM.NUM);
    } else {
        displayItems(tracks[1], Type.TRACK);
    }   
    $("#term-length").text(currentDuration);
    $("#track-download-btn").removeClass("disabled");
    $("#track-download-btn").prop('disabled', false);
    $("#download-btn-wrapper").fadeIn(downloadBtnFadeIn);
});

document.getElementById('get-tracks-l').addEventListener('click', function() {
    $("#track-chart-wrapper").fadeIn(BtnFadeIn);
    $("#track-chart-buttons").children().removeClass("active");
    $("#get-tracks-l").addClass("active");
    currentDuration = "Long Term";
    currentTrackNum = 2;
    if (tracks[2] === undefined) {
        getSpotifyItems(tracks, Type.TRACK, Duration.LONG.NAME, Duration.LONG.NUM);
    } else {
        displayItems(tracks[2], Type.TRACK);
    }
    $("#term-length").text(currentDuration);   
    $("#track-download-btn").removeClass("disabled");
    $("#track-download-btn").prop('disabled', false);
    $("#download-btn-wrapper").fadeIn(downloadBtnFadeIn);
});

document.getElementById('get-artists-s').addEventListener('click', function() {
    $("#artist-chart").fadeIn(BtnFadeIn);
    $("#artist-chart-buttons").children().removeClass("active");
    $("#get-artists-s").addClass("active");
    if (artists[0] === undefined) {
        getSpotifyItems(artists, Type.ARTIST, Duration.SHORT.NAME, Duration.SHORT.NUM);
    } else {
        displayItems(artists[0], Type.ARTIST);
    }
});

document.getElementById('get-artists-m').addEventListener('click', function() {
    $("#artist-chart").fadeIn(BtnFadeIn);
    $("#artist-chart-buttons").children().removeClass("active");
    $("#get-artists-m").addClass("active");
    if (artists[1] === undefined) {
        getSpotifyItems(artists, Type.ARTIST, Duration.MEDIUM.NAME, Duration.MEDIUM.NUM);
    } else {
        displayItems(artists[1], Type.ARTIST);
    }
  
});

document.getElementById('get-artists-l').addEventListener('click', function() {
    $("#artist-chart").fadeIn(BtnFadeIn);
    $("#artist-chart-buttons").children().removeClass("active");
    $("#get-artists-l").addClass("active");
    if (artists[2] === undefined) {
        getSpotifyItems(artists, Type.ARTIST, Duration.LONG.NAME, Duration.LONG.NUM);
    } else {
        displayItems(artists[2], Type.ARTIST);
    }
});

function getSpotifyItems(arr, type, durationName, durationNum) {
  if (isAuthenticated) {
    $.ajax({
      url: 'https://api.spotify.com/v1/me/top/' + type + '?' + 'time_range=' + durationName + '&limit=50',
      headers: {
        'Authorization': 'Bearer ' + access_token
      },
      success: function(response) {
        arr[durationNum] = [];
        (response.items).map( function(item) {
          arr[durationNum].push(item);
        });

        displayItems(arr[durationNum], type);

      },
      async: true
    });
  } else {
    authenticate();
  }
}

function displayItems(items, type) {
  var currentChart;
    var maxVal = 50;

  if (type === "tracks") {
    currentChart = $("#track-chart");
  } else {
    currentChart = $("#artist-chart");
    maxVal = 50;
  }

  currentChart.empty();
  var index = 0;
  items.slice(0,maxVal).map( function(item) {
    index++;
    var tableRow = $("<tr></tr>");
  
    var number = $("<td></td>");
    number.text(index);
    tableRow.append(number);
    
    var name = $("<td></td>");
    name.text(item.name);
    tableRow.append(name);

    var artist;
    if (type === "tracks") {
      artist = $("<td></td>");
      artist.text(item.artists[0].name);
      tableRow.append(artist);
    }

    currentChart.append(tableRow);
  });
}

$("#get-tracks-l").bind('scroll', function() {
    $("#get-tracks-l").trigger('click');
    //$("#get-artists-l").trigger('click');
 });

$(window).on('load', function() {
    authenticate();
});