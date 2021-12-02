// server.js
// where your node app starts
if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}
// init project
var qs = require('querystring');
var express = require('express');
var app = express();

// init Spotify API wrapper
var PORT = 3001;
var CLIENT_ID = process.env.CLIENT_ID;
var CLIENT_SECRET = process.env.CLIENT_SECRET;
var REDIRECT_URL = 'https://spotify.spencerpauly.com';

var SpotifyWebApi = require('spotify-web-api-node');

var spotifyApi = new SpotifyWebApi({
	clientId: CLIENT_ID,
	clientSecret: CLIENT_SECRET,
});

var path = require('path');
var appDir = path.dirname(require.main.filename);

const oldScopes = [
	'ugc-image-upload',
	'streaming',
	'user-library-modify',
	'user-library-read',
	'user-read-birthdate',
	'user-read-email',
	'user-read-private',
	'user-modify-playback-state',
	'user-read-private',
	'user-read-private',
	'user-top-read',
	'user-read-recently-played',
	'playlist-modify-public',
	'playlist-modify-private',
	'playlist-read-collaborative',
	'playlist-read-private',
];

const jssdkscopes = [
	'user-library-modify',
	'user-library-read',
	'user-read-email',
	'user-read-private',
	'user-modify-playback-state',
	'user-read-private',
	'user-read-private',
	'user-top-read',
	'playlist-modify-public',
	'playlist-modify-private',
	'playlist-read-collaborative',
	'playlist-read-private',
];
const redirectUriParameters = {
	client_id: CLIENT_ID,
	response_type: 'token',
	scope: jssdkscopes.join(' '),
	redirect_uri: encodeURI(REDIRECT_URL),
	show_dialog: true,
};

const redirectUri = `https://accounts.spotify.com/authorize?${qs.stringify(redirectUriParameters)}`;

function authenticate(callback) {
	spotifyApi.clientCredentialsGrant().then(
		function (data) {
			console.log('The access token expires in ' + data.body['expires_in']);
			console.log('The access token is ' + data.body['access_token']);

			callback instanceof Function && callback();

			// Save the access token so that it's used in future calls
			spotifyApi.setAccessToken(data.body['access_token']);
		},
		function (err) {
			console.log('Something went wrong when retrieving an access token', err.message);
		}
	);
}
authenticate();

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

app.get('/search', function (request, response) {
	reAuthenticateOnFailure((failure) => {
		spotifyApi.searchTracks(request.query.query, { limit: 2 }).then(function (data) {
			response.send(data.body);
		}, failure);
	});
});

const reAuthenticateOnFailure = (action) => {
	action(() => {
		authenticate(action);
	});
};

app.get('/spotifyRedirectUri', function (request, response) {
	response.send(
		JSON.stringify(
			{
				redirectUri,
			},
			null,
			2
		)
	);
});

app.get('/spotify/features', function (request, response) {
	reAuthenticateOnFailure((failure) => {
		spotifyApi.getAudioFeaturesForTrack(request.query.id).then(function (data) {
			response.send(data.body);
		}, failure);
	});
});

app.get('/spotify/analysis', function (request, response) {
	reAuthenticateOnFailure((failure) => {
		spotifyApi.getAudioAnalysisForTrack(request.query.id).then(function (data) {
			response.send(data.body);
		}, failure);
	});
});

// listen for requests :)
var listener = app.listen(PORT, function () {
	console.log('Your app is listening on port ' + PORT);
	console.log(appDir);
});
