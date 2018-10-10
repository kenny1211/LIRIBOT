require("dotenv").config();
const keys = require("./keys.js");
const Spotify = require('node-spotify-api');
const spotify = new Spotify(keys.spotify);
const request = require("request");
const fs = require("fs");
let command = process.argv[2];
let input = process.argv.slice(3).join(" ");

switch (command) {
  case "concert-this":
    concertThis();
    break;
  case "spotify-this-song":
    spotifyThisSong();
    break;
  case "movie-this":
    movieThis();
    break;
  case "do-what-it-says":
    doWhatItSays();
    break;
  default:
    console.log("Invalid command.");
}
function concertThis() {
const artist = input;
const queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

request(queryUrl, function(error, response, body) {

  if (!error && response.statusCode === 200) {
    
    console.log(JSON.parse(body));
  }
});

}

function spotifyThisSong() {
  spotify.search({ type: 'track', query: input }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }

    const getArtist = function (artist) {
      return artist.name;
      };

    const response = data.tracks.items;

      for (var i = 0; i < response.length; i++) {
        console.log(`==========
${i}
Artist(s): ${response[i].artists.map(getArtist)}
Song: ${response[i].name}
Preview URL: ${response[i].preview_url}
Album: ${response[i].album.name}
==========`);
    }
  });
}

function movieThis() {
  const movieName = input;
  const queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

  request(queryUrl, function(error, response, body) {

    if (!error && response.statusCode === 200) {
      // console.log(JSON.parse(body, null, 2));
      console.log(`==========
Title: ${JSON.parse(body).Title}
Year: ${JSON.parse(body).Year}
IMDB Rating: ${JSON.parse(body).imdbRating}
Country of Production: ${JSON.parse(body).Country}
Language of Movie: ${JSON.parse(body).Language}
Plot of Movie: ${JSON.parse(body).Plot}
Actors: ${JSON.parse(body).Actors}
==========`)
    }
  });
}

function doWhatItSays() {

  fs.readFile("random.txt", "utf8", function (err, data) {
    if (err) throw err;

    const doThis = data.split(',');
    command = doThis[0];
    input = doThis[1];
    spotifyThisSong();
});
}